import { Asset, Updates } from "expo";
import React from "react";
import {
  Alert,
  AppState,
  BackHandler,
  ConnectionInfo,
  ConnectionType,
  NetInfo,
  View,
} from "react-native";
import { createAppContainer } from "react-navigation";

import ErrorComponent from "@src/components/ErrorComponent";
import {
  LoadingComponent,
  TransparentLoadingComponent,
} from "@src/components/LoadingComponent";
import { CustomToast } from "@src/components/ToastComponent";
import createAppNavigator from "@src/NavigatorConfig";
import GlobalContext, {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
  ToastMessageArgs,
} from "@src/providers/GlobalStateContext";
import { GlobalStateValues } from "@src/providers/GlobalStateProvider";
import SoundRecordingProvider from "@src/providers/SoundRecordingProvider";
import { fetchLessonSet, findOrCreateUser } from "@src/tools/api";
import {
  getAppLanguageSetting,
  getPersistedUser,
  saveUserToAsyncStorage,
  setAppLanguageSetting,
} from "@src/tools/async-store";
import {
  createSerializedAppDifficultyHandler,
  createSerializedUserExperienceHandler,
  createSerializedUserScoresHandler,
  deserializeAndRunRequest,
  deserializeRequestQueue,
  RequestQueue,
  serializeRequestQueue,
} from "@src/tools/offline-utils";
import { GoogleSigninUser, User } from "@src/tools/types";
import {
  createWordDictionaryFromLessons,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
  isNetworkConnected,
  transformGoogleSignInResultToUserData,
  transformUserToLocalUserData,
} from "@src/tools/utils";
import { DEFAULT_SCORE_STATE } from "@tests/data";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IState extends GlobalStateValues {
  error: boolean;
  loading: boolean;
  appState: string;
  toastMessage: string;
  updating: boolean;
  tryingToCloseApp: boolean;
  transparentLoading: boolean;
  networkConnected: boolean;
  offlineRequestQueue: RequestQueue;
  processingOfflineRequestQueue: boolean;
}

const TOAST_TIMEOUT = 5000; /* 5 seconds */

/** ========================================================================
 * Root Container Base Component
 * =========================================================================
 */

// tslint:disable-next-line
class RootContainerBase<Props> extends React.Component<Props, IState> {
  timeout: NodeJS.Timeout | null = null;
  navigationRef: any = null;
  networkConnectivityUnsubscribeHandler: any = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      error: false,
      lessons: [],
      experience: 0,
      loading: true,
      toastMessage: "",
      updating: false,
      wordDictionary: {},
      updateAvailable: false,
      offlineRequestQueue: [],
      tryingToCloseApp: false,
      transparentLoading: false,
      networkConnected: true,
      appState: AppState.currentState,
      processingOfflineRequestQueue: false,
      userScoreStatus: DEFAULT_SCORE_STATE,
      languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
      appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
    };
  }

  setupNetworkListener = async () => {
    /**
     * Get initial network state and add a listener for network changes.
     */
    const networkState = await NetInfo.getConnectionInfo();

    const isConnected = isNetworkConnected(networkState.type);
    this.setState(
      {
        networkConnected: isConnected,
      },
      this.handlingRestoringOfflineRequestQueue,
    );

    console.log(`Initial network state: ${isConnected}`);

    // tslint:disable-next-line
    this.networkConnectivityUnsubscribeHandler = NetInfo.addEventListener(
      "connectionChange",
      this.handleConnectivityChange,
    );
  };

  handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.handleAppForegroundingEvent();
    } else {
      this.handleAppBackgroundingEvent();
    }

    this.setState({ appState: nextAppState });
  };

  handleAppForegroundingEvent = () => {
    this.checkForAppUpdate();
  };

  handleAppBackgroundingEvent = async () => {
    // Handle any app backgrounding side effects here
  };

  serializeAndPersistAppState = async () => {
    console.log("Serializing app state");
    const { offlineRequestQueue } = this.state;
    if (offlineRequestQueue.length) {
      await serializeRequestQueue(offlineRequestQueue);
    }
    await this.serializeAndPersistUser();
  };

  handlingRestoringOfflineRequestQueue = async () => {
    const queue = await deserializeRequestQueue();
    /**
     * If app is online enqueue and process all the stored requests.
     *
     * Otherwise, just add them to local state to be processed whenever network
     * connectivity is restored.
     */
    if (this.state.networkConnected) {
      if (queue.length) {
        console.log("Queued requests found and app online - processing now");
        this.setToastMessage({
          shouldNotExpire: true,
          message: "Unsaved progress found - saving now...",
        });
        this.setState(
          {
            offlineRequestQueue: queue,
          },
          this.maybeProcessOfflineRequests,
        );
      }
    } else {
      if (queue.length) {
        this.setState({
          offlineRequestQueue: queue,
        });
      }

      this.setToastMessage(
        "You are offline - any progress will be saved when network is restored.",
      );
    }
  };

  maybeProcessOfflineRequests = async () => {
    /**
     * Dequeue and process any requests if they exist when the network connection
     * is restored.
     */
    const { offlineRequestQueue } = this.state;
    if (offlineRequestQueue.length) {
      this.setToastMessage({
        shouldNotExpire: true,
        message: "Offline progress found. Saving updates...",
      });
      await this.processRequestQueue(offlineRequestQueue);
      this.setState(
        {
          offlineRequestQueue: [],
          processingOfflineRequestQueue: false,
        },
        async () => {
          await serializeRequestQueue([]);
          this.clearToast();
          this.setToastMessage("All updates saved!");
        },
      );
    }
  };

  processRequestQueue = async (queue: RequestQueue) => {
    /**
     * Network re-connection events can fire multiple times - keep a flag
     * to only process the request queue on time.
     */
    for (const serializedRequestData of queue) {
      console.log(`Processing request... ${serializedRequestData.type}`);
      await deserializeAndRunRequest(serializedRequestData);
    }
  };

  handleConnectivityChange = (
    connectionInfo: ConnectionInfo | ConnectionType,
  ) => {
    let isConnected: boolean;
    if (typeof connectionInfo === "string") {
      isConnected = isNetworkConnected(connectionInfo);
    } else {
      isConnected = isNetworkConnected(connectionInfo.type);
    }

    console.log(`Network change - network online: ${isConnected}`);

    this.setState({ networkConnected: isConnected }, () => {
      if (isConnected && !this.state.processingOfflineRequestQueue) {
        this.setState(
          {
            processingOfflineRequestQueue: true,
          },
          this.maybeProcessOfflineRequests,
        );
      } else {
        this.setToastMessage(
          "Network connectivity lost... any updates will be saved when network is restored.",
        );
      }
    });
  };

  serializeAndPersistUser = async () => {
    if (this.state.user) {
      const user: User = {
        ...this.state.user,
        experience_points: this.state.experience,
        score_history: this.state.userScoreStatus,
        app_difficulty_setting: this.state.appDifficultySetting,
      };
      await saveUserToAsyncStorage(user);
    }
  };

  setupUserSessionFromPersistedUserData = async (maybePersistedUser: User) => {
    if (maybePersistedUser) {
      this.setState({
        user: transformUserToLocalUserData(maybePersistedUser),
        experience: maybePersistedUser.experience_points,
        userScoreStatus: maybePersistedUser.score_history,
        appDifficultySetting: maybePersistedUser.app_difficulty_setting,
      });
    }
  };

  checkForAppUpdate = async (): Promise<void> => {
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        Alert.alert(
          "Update Available!",
          "Confirm to update now 🛰",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => this.setState({ updateAvailable: true }),
            },
            { text: "OK", onPress: this.handleUpdateApp },
          ],
          { cancelable: false },
        );
      }
    } catch (err) {
      return;
    }
  };

  handleUpdateApp = () => {
    try {
      this.setState(
        {
          updating: true,
        },
        async () => {
          await Updates.fetchUpdateAsync();
          Updates.reloadFromCache();
        },
      );
    } catch (err) {
      this.setState({
        updating: false,
        toastMessage: "Update failed...",
      });
    }
  };

  clearTimer = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  abortTryingToClose = () => {
    this.setState({ tryingToCloseApp: false });
  };

  setToastMessage = (args: string | ToastMessageArgs): void => {
    this.clearTimer();
    let message: string;
    let timeout = TOAST_TIMEOUT;
    let shouldNotExpire = false;
    if (typeof args === "string") {
      message = args;
    } else {
      message = args.message;
      timeout = args.timeout || TOAST_TIMEOUT;
      shouldNotExpire = Boolean(args.shouldNotExpire);
    }

    this.setState(
      {
        toastMessage: message,
      },
      () => {
        if (!shouldNotExpire) {
          // tslint:disable-next-line
          this.timeout = setTimeout(() => {
            this.clearToast();
            this.abortTryingToClose();
          }, timeout);
        }
      },
    );
  };

  clearToast = () => {
    this.clearTimer();
    this.setState({
      toastMessage: "",
    });
  };

  canCloseApp = (): any => {
    try {
      if (this.navigationRef) {
        return this.navigationRef.state.nav.routes[0].routes.length === 1;
      }
    } catch (_) {
      return true;
    }
  };
}

/** ========================================================================
 * Main App Class
 * =========================================================================
 */
class RootContainer extends RootContainerBase<{}> {
  async componentDidMount(): Promise<void> {
    /**
     * Initial user scores.
     */
    this.initializeAppState();

    /**
     * Initialize network listener and setup initial network state.
     */
    this.setupNetworkListener();

    /**
     * Manage state to assign a toast warning if user tries to
     * press the back button when it will close the app. Show them
     * a toast and allow them to press again to close the app.
     */
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.canCloseApp()) {
        if (!this.state.tryingToCloseApp) {
          this.setState(
            {
              tryingToCloseApp: true,
            },
            () => this.setToastMessage("Press again to close app"),
          );
          return true;
        } else {
          return this.setState(
            {
              tryingToCloseApp: false,
            },
            BackHandler.exitApp,
          );
        }
      }

      return false;
    });

    /**
     * Add listener to AppState to detect app foreground/background actions.
     */
    AppState.addEventListener("change", this.handleAppStateChange);

    /**
     * Check for updates when app is first opened.
     */
    this.checkForAppUpdate();
  }

  componentWillUnmount(): void {
    /**
     * Remove listeners and clear any existing timeout.
     */
    BackHandler.removeEventListener("hardwareBackPress", () => {
      return;
    });

    AppState.removeEventListener("change", this.handleAppStateChange);

    this.clearTimer();
  }

  render(): JSX.Element {
    const {
      user,
      error,
      loading,
      lessons,
      updating,
      experience,
      wordDictionary,
      languageSetting,
      userScoreStatus,
      updateAvailable,
      networkConnected,
      transparentLoading,
      appDifficultySetting,
    } = this.state;
    if (error) {
      return <ErrorComponent />;
    } else if (updating || loading) {
      return <LoadingComponent />;
    }

    return (
      <View style={{ flex: 1 }}>
        {transparentLoading && <TransparentLoadingComponent />}
        <CustomToast
          close={this.clearToast}
          message={this.state.toastMessage}
        />
        <GlobalContext.Provider
          value={{
            user,
            lessons,
            experience,
            wordDictionary,
            updateAvailable,
            networkConnected,
            languageSetting,
            userScoreStatus,
            appDifficultySetting,
            onSignin: this.handleSignin,
            setLessonScore: this.setLessonScore,
            setToastMessage: this.setToastMessage,
            handleUpdateApp: this.handleUpdateApp,
            handleResetScores: this.handleResetScores,
            handleSwitchLanguage: this.handleSwitchLanguage,
            handleUpdateAppDifficultySetting: this
              .handleUpdateAppDifficultySetting,
          }}
        >
          <SoundRecordingProvider>
            <RenderAppOnce
              userLoggedIn={Boolean(user)}
              assignNavigatorRef={this.assignNavRef}
            />
          </SoundRecordingProvider>
        </GlobalContext.Provider>
      </View>
    );
  }

  initializeAppState = async () => {
    /**
     * Fetch image assets.
     *
     * TODO: Bundle this asset.
     */
    await Asset.fromModule(
      require("@src/assets/google_icon.png"),
    ).downloadAsync();

    /**
     * Fetch lessons
     */
    const lessons = fetchLessonSet();
    const wordDictionary = createWordDictionaryFromLessons(lessons);
    this.setState(
      {
        lessons,
        wordDictionary,
        languageSetting: await getAppLanguageSetting(),
      },
      this.initializeUserSession,
    );
  };

  initializeUserSession = async () => {
    const maybePersistedUser = await getPersistedUser();
    if (maybePersistedUser && maybePersistedUser.email) {
      /**
       * Restore user session:
       *
       * - fetch from server if network is isConnected
       * - otherwise try to restore from local data
       */
      if (this.state.networkConnected) {
        const user = await findOrCreateUser(maybePersistedUser);
        if (user) {
          this.setState({
            loading: false,
            transparentLoading: false,
            user: transformUserToLocalUserData(user),
            experience: user.experience_points,
            userScoreStatus: JSON.parse(user.score_history),
            appDifficultySetting: user.app_difficulty_setting,
          });
        }
      } else {
        /**
         * Fallback to local user data, if it exists. This allows the app
         * to be used offline.
         */
        this.setupUserSessionFromPersistedUserData(maybePersistedUser);
      }
    }
    /**
     * No local user found. Disable loading which will render the
     * signin screen.
     */
    this.setState({ loading: false });
  };

  handleSignin = async (user: GoogleSigninUser) => {
    /**
     * Transform received user data from Google and find or create the associated
     * user on the app server. If the user data doesn't exist or is invalid, throw
     * an error which will be caught and handled by the GoogleSigninScreen.
     */
    if (user && user.email) {
      const userData = transformGoogleSignInResultToUserData(user);
      const userResult = await findOrCreateUser(userData);
      if (userResult) {
        this.setState(
          {
            user: transformUserToLocalUserData(userResult),
          },
          this.serializeAndPersistUser,
        );
      } else {
        throw new Error("Failed to initialize user");
      }
    } else {
      throw new Error("Failed to initialize user");
    }
  };

  setLessonScore = async (
    updatedScoreStatus: ScoreStatus,
    lessonExperience: number,
  ) => {
    const { user, experience } = this.state;
    if (user && user.uuid) {
      const userId = user.uuid;
      const updatedExperience = experience + lessonExperience;
      this.setState(
        {
          experience: updatedExperience,
          userScoreStatus: updatedScoreStatus,
        },
        () => {
          this.requestMiddlewareHandler([
            createSerializedUserExperienceHandler(userId, updatedExperience),
            createSerializedUserScoresHandler(userId, updatedScoreStatus),
          ]);
        },
      );
    }
  };

  handleUpdateAppDifficultySetting = async (
    appDifficultySetting: APP_DIFFICULTY_SETTING,
  ) => {
    const { user } = this.state;
    if (user && user.uuid) {
      const userId = user.uuid;
      this.setState(
        {
          transparentLoading: true,
        },
        async () => {
          this.updateAppDifficulty(userId, appDifficultySetting);
        },
      );
    }
  };

  updateAppDifficulty = async (
    userId: string,
    appDifficultySetting: APP_DIFFICULTY_SETTING,
  ) => {
    this.setState(
      {
        appDifficultySetting,
        transparentLoading: false,
      },
      () => {
        this.setToastMessage("App difficulty updated");
        this.requestMiddlewareHandler([
          createSerializedAppDifficultyHandler(userId, appDifficultySetting),
        ]);
      },
    );
  };

  requestMiddlewareHandler = async (serializedRequestData: RequestQueue) => {
    /**
     * Top level handler for network request updates. If the app is online, the request
     * is made. Otherwise, the request is enqueue to be processed later when network
     * connectivity is reestablished.
     */
    if (this.state.networkConnected) {
      this.processRequestQueue(serializedRequestData);
    } else {
      console.log(
        "Request received - app offline, enqueueing to process later",
      );
      this.setState(
        ({ offlineRequestQueue }) => ({
          offlineRequestQueue: [
            ...offlineRequestQueue,
            ...serializedRequestData,
          ],
        }),
        this.serializeAndPersistAppState,
      );
    }
  };

  handleResetScores = () => {
    Alert.alert(
      "Are you sure?",
      "All existing progress will be erased and you will have to start over! This is irreversible 🤯",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: this.resetScores,
        },
      ],
      { cancelable: false },
    );
  };

  resetScores = () => {
    this.setState(
      {
        transparentLoading: true,
      },
      () => {
        // tslint:disable-next-line
        this.timeout = setTimeout(async () => {
          this.setState(
            {
              experience: 0,
              transparentLoading: false,
              userScoreStatus: DEFAULT_SCORE_STATE,
            },
            this.handleResetScoresSuccess,
          );
        }, 1250);
      },
    );
  };

  handleResetScoresSuccess = async () => {
    const { user } = this.state;
    if (user && user.uuid) {
      const userId = user.uuid;
      this.setToastMessage("Scores reset!");
      this.requestMiddlewareHandler([
        createSerializedUserExperienceHandler(userId, 0),
        createSerializedUserScoresHandler(userId, DEFAULT_SCORE_STATE),
      ]);
    }
  };

  handleSwitchLanguage = () => {
    const { languageSetting } = this.state;
    const alternate = getAlternateLanguageSetting(languageSetting);

    Alert.alert(
      `Your current setting is ${formatUserLanguageSetting(
        this.state.languageSetting,
      )}`,
      `Do you want to switch to ${formatUserLanguageSetting(
        alternate,
      )}? You can switch back at anytime.`,
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.switchLanguage(),
        },
      ],
      { cancelable: false },
    );
  };

  switchLanguage = () => {
    const setLanguage = (languageSetting: APP_LANGUAGE_SETTING) => {
      return this.setState(
        {
          languageSetting,
        },
        async () => {
          this.handleSetLanguageSuccess(languageSetting);
        },
      );
    };

    switch (this.state.languageSetting) {
      case APP_LANGUAGE_SETTING.SIMPLIFIED:
        return setLanguage(APP_LANGUAGE_SETTING.TRADITIONAL);
      case APP_LANGUAGE_SETTING.TRADITIONAL:
        return setLanguage(APP_LANGUAGE_SETTING.SIMPLIFIED);
      default:
        console.log(
          `Unknown language setting received: ${this.state.languageSetting}`,
        );
        return setLanguage(APP_LANGUAGE_SETTING.SIMPLIFIED);
    }
  };

  handleSetLanguageSuccess = (languageSetting: APP_LANGUAGE_SETTING) => {
    setAppLanguageSetting(languageSetting);
    this.setToastMessage(
      `Language set to ${formatUserLanguageSetting(languageSetting)}`,
    );
  };

  assignNavRef = (ref: any) => {
    // tslint:disable-next-line
    this.navigationRef = ref;
  };
}

/** ========================================================================
 * App Component
 * =========================================================================
 */

interface RenderAppOnceProps {
  assignNavigatorRef: (ref: any) => void;
  userLoggedIn: boolean;
}

// tslint:disable-next-line
class RenderAppOnce extends React.Component<RenderAppOnceProps, {}> {
  shouldComponentUpdate(_: RenderAppOnceProps): boolean {
    return false;
  }

  render(): JSX.Element {
    const AppNavigator = createAppNavigator(this.props.userLoggedIn);
    const Nav = createAppContainer(AppNavigator);
    return <Nav ref={this.props.assignNavigatorRef} />;
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default RootContainer;
