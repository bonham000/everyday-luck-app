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
} from "@src/providers/GlobalStateContext";
import { GlobalStateValues } from "@src/providers/GlobalStateProvider";
import SoundRecordingProvider from "@src/providers/SoundRecordingProvider";
import {
  fetchLessonSet,
  findOrCreateUser,
  updateAppDifficultySetting,
  updateUserExperience,
  updateUserScores,
} from "@src/tools/api";
import {
  getAppLanguageSetting,
  getLocalUser,
  GoogleSigninUser,
  setAppLanguageSetting,
} from "@src/tools/store";
import { HSKListSet } from "@src/tools/types";
import {
  createWordDictionaryFromLessons,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
  isNetworkConnected,
} from "@src/tools/utils";
import { DEFAULT_SCORE_STATE } from "@tests/data";

/** ========================================================================
 * Types
 * =========================================================================
 */

type GenericRequestFunction = (args?: any) => Promise<any>;

interface IState extends GlobalStateValues {
  userId?: string;
  error: boolean;
  loading: boolean;
  appState: string;
  toastMessage: string;
  updating: boolean;
  tryingToCloseApp: boolean;
  transparentLoading: boolean;
  networkConnected: boolean;
  offlineRequestQueue: ReadonlyArray<GenericRequestFunction>;
}

const TOAST_TIMEOUT = 4000; /* 4 seconds */

/** ========================================================================
 * Root Container Base Component
 * =========================================================================
 */

// tslint:disable-next-line
class RootContainerBase<Props> extends React.Component<Props, IState> {
  timeout: any = null;
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
      offlineRequestQueue: [],
      tryingToCloseApp: false,
      transparentLoading: false,
      networkConnected: true,
      appState: AppState.currentState,
      userScoreStatus: DEFAULT_SCORE_STATE,
      languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
      appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
    };
  }

  canCloseApp = () => {
    try {
      return this.navigationRef.state.nav.routes[0].routes.length === 1;
    } catch (_) {
      return true;
    }
  };

  setupNetworkListener = async () => {
    /**
     * Get initial network state and add a listener for network changes.
     */
    const networkState = await NetInfo.getConnectionInfo();
    this.setState({
      networkConnected: isNetworkConnected(networkState.type),
    });

    console.log(networkState);
    console.log(
      `Initial network state: ${isNetworkConnected(networkState.type)}`,
    );

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

  handleAppBackgroundingEvent = async () => {
    console.log("App backgrounded...");
  };

  handleAppForegroundingEvent = () => {
    this.checkForAppUpdate();
  };

  maybeProcessOfflineRequests = async () => {
    const { offlineRequestQueue } = this.state;
    if (offlineRequestQueue.length) {
      this.setToastMessage(
        "Offline progress found. Saving updates...",
        Infinity,
      );
      for (const requestFn of offlineRequestQueue) {
        console.log("Processing request...");
        await requestFn();
      }
      this.setState(
        {
          offlineRequestQueue: [],
        },
        () => {
          this.clearToast();
          this.setToastMessage("All progress saved!");
        },
      );
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
            { text: "Cancel", onPress: () => null, style: "cancel" },
            { text: "OK", onPress: this.updateApp },
          ],
          { cancelable: false },
        );
      }
    } catch (err) {
      return;
    }
  };

  updateApp = () => {
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

  setToastMessage = (
    toastMessage: string,
    timeout: number = TOAST_TIMEOUT,
  ): void => {
    this.clearTimer();
    this.setState(
      {
        toastMessage,
      },
      () => {
        // tslint:disable-next-line
        this.timeout = setTimeout(() => {
          this.clearToast();
          this.abortTryingToClose();
        }, timeout);
      },
    );
  };

  clearToast = () => {
    this.setState(
      {
        toastMessage: "",
      },
      this.clearTimer,
    );
  };

  handleConnectivityChange = (
    connectionInfo: ConnectionInfo | ConnectionType,
  ) => {
    let onlineStatus: boolean;
    if (typeof connectionInfo === "string") {
      onlineStatus = isNetworkConnected(connectionInfo);
    } else {
      onlineStatus = isNetworkConnected(connectionInfo.type);
    }

    console.log(`Network change - network online: ${onlineStatus}`);

    this.setState({ networkConnected: onlineStatus }, () => {
      if (onlineStatus) {
        this.maybeProcessOfflineRequests();
      }
    });
  };
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class RootContainer extends RootContainerBase<{}> {
  async componentDidMount(): Promise<void> {
    this.getInitialScoreState();

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

  render(): JSX.Element | null {
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
      transparentLoading,
      appDifficultySetting,
    } = this.state;
    if (error) {
      return <ErrorComponent />;
    } else if (updating || loading) {
      return <LoadingComponent />;
    }

    const lessonSet = lessons as HSKListSet;
    const authenticatedUser = user as GoogleSigninUser;

    return (
      <View style={{ flex: 1 }}>
        {transparentLoading && <TransparentLoadingComponent />}
        <CustomToast
          close={this.clearToast}
          message={this.state.toastMessage}
        />
        <GlobalContext.Provider
          value={{
            experience,
            wordDictionary,
            languageSetting,
            userScoreStatus,
            lessons: lessonSet,
            appDifficultySetting,
            user: authenticatedUser,
            onSignin: this.handleSignin,
            setLessonScore: this.setLessonScore,
            setToastMessage: this.setToastMessage,
            handleResetScores: this.handleResetScores,
            handleSwitchLanguage: this.handleSwitchLanguage,
            handleUpdateAppDifficultySetting: this
              .handleUpdateAppDifficultySetting,
          }}
        >
          <SoundRecordingProvider>
            <RenderAppOnce
              userLoggedIn={Boolean(this.state.user)}
              assignNavigatorRef={this.assignNavRef}
            />
          </SoundRecordingProvider>
        </GlobalContext.Provider>
      </View>
    );
  }

  getInitialScoreState = async () => {
    /**
     * Fetch image assets
     */
    await Asset.fromModule(
      require("@src/assets/google_icon.png"),
    ).downloadAsync();

    /**
     * Fetch lessons
     */
    const lessons = await fetchLessonSet();

    if (!lessons) {
      this.setState({
        error: true,
      });
    } else {
      const wordDictionary = createWordDictionaryFromLessons(lessons);
      this.setState(
        {
          lessons,
          wordDictionary,
          languageSetting: await getAppLanguageSetting(),
        },
        this.setupUserSession,
      );
    }
  };

  setupUserSession = async () => {
    const localUser = await getLocalUser();

    if (localUser && localUser.email) {
      const user = await findOrCreateUser(localUser.email);

      if (user) {
        const scoreHistory = JSON.parse(user.score_history);
        this.setState({
          loading: false,
          transparentLoading: false,
          user: localUser,
          userId: user.uuid,
          experience: user.experience_points,
          userScoreStatus: scoreHistory,
          appDifficultySetting: user.app_difficulty_setting,
        });
      }
    }
    /**
     * No local user found. Disable loading which will render the
     * signin screen.
     */
    this.setState({ loading: false });
  };

  handleSignin = async (user: GoogleSigninUser) => {
    if (user && user.email) {
      const userResult = await findOrCreateUser(user.email);
      if (userResult) {
        this.setState({ user, userId: userResult.uuid });
      }
    } else {
      // TODO: Handle missing email...
      console.log("User found with no email...");
    }
  };

  setLessonScore = async (
    updatedScoreStatus: ScoreStatus,
    lessonExperience: number,
  ) => {
    const { userId, experience } = this.state;
    if (userId) {
      const updatedExperience = experience + lessonExperience;
      this.setState(
        {
          experience: updatedExperience,
          userScoreStatus: updatedScoreStatus,
        },
        () => {
          this.requestMiddlewareHandler(async () => {
            await updateUserExperience(userId, updatedExperience);
            await updateUserScores(userId, updatedScoreStatus);
          });
        },
      );
    }
  };

  handleUpdateAppDifficultySetting = async (
    appDifficultySetting: APP_DIFFICULTY_SETTING,
  ) => {
    const { userId } = this.state;
    if (userId) {
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
        this.requestMiddlewareHandler(() =>
          updateAppDifficultySetting(userId, appDifficultySetting),
        );
      },
    );
  };

  requestMiddlewareHandler = (asyncRequestFunction: GenericRequestFunction) => {
    if (this.state.networkConnected) {
      console.log("Request received - app online processing now");
      asyncRequestFunction();
    } else {
      console.log(
        "Request received - app offline, enqueueing to process later",
      );
      this.setState(({ offlineRequestQueue }) => ({
        offlineRequestQueue: offlineRequestQueue.concat(asyncRequestFunction),
      }));
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
            () => {
              this.setToastMessage("Scores reset!");
              this.requestMiddlewareHandler(async () => {
                const { userId } = this.state;
                if (userId) {
                  await updateUserExperience(userId, 0);
                  await updateUserScores(userId, DEFAULT_SCORE_STATE);
                }
              });
            },
          );
        }, 1250);
      },
    );
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
