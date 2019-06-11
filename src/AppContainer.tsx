import { Updates } from "expo";
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
import { createAppContainer, NavigationActions } from "react-navigation";

import ErrorComponent from "@src/components/ErrorComponent";
import {
  LoadingComponent,
  TransparentLoadingComponent,
} from "@src/components/LoadingComponent";
import { CustomToast } from "@src/components/ToastComponent";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import createAppNavigator from "@src/NavigatorConfig";
import GlobalContext, {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
  ToastMessageArgs,
  UserSettings,
} from "@src/providers/GlobalStateContext";
import { GlobalStateValues } from "@src/providers/GlobalStateProvider";
import SoundRecordingProvider from "@src/providers/SoundRecordingProvider";
import { createUser, getUser, updateUser } from "@src/tools/api";
import {
  getOfflineUpdatesFlagState,
  getPersistedUser,
  saveUserToAsyncStorage,
  setOfflineUpdatesFlagState,
} from "@src/tools/async-store";
import { registerForPushNotificationsAsync } from "@src/tools/notification-utils";
import { User } from "@src/tools/types";
import {
  createWordDictionaryFromLessons,
  fetchLessonSet,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
  isNetworkConnected,
  transformUserJson,
} from "@src/tools/utils";
import MOCKS from "@tests/mocks";

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
  firstTimeUser: boolean;
  tryingToCloseApp: boolean;
  transparentLoading: boolean;
  networkConnected: boolean;
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
      loading: true,
      toastMessage: "",
      updating: false,
      wordDictionary: {},
      firstTimeUser: false,
      updateAvailable: false,
      tryingToCloseApp: false,
      transparentLoading: false,
      networkConnected: true,
      appState: AppState.currentState,
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
      this.handleRestoringOfflineChangesOnAppLoad,
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
      if (isConnected) {
        this.maybeHandleOfflineUpdates();
      } else {
        this.setToastMessage(
          "Network connectivity lost... any updates will be saved when network is restored.",
        );
      }
    });
  };

  handleRestoringOfflineChangesOnAppLoad = async () => {
    if (this.state.networkConnected) {
      this.maybeHandleOfflineUpdates();
    } else {
      this.setToastMessage(
        "You are offline - any progress will be saved when network is restored.",
      );
    }
  };

  maybeHandleOfflineUpdates = async () => {
    const offlineFlag = await getOfflineUpdatesFlagState();
    if (offlineFlag.shouldProcessRequests) {
      this.performUserUpdate(offlineFlag.shouldProcessRequests);
    }
  };

  performUserUpdate = async (offlineFlag?: boolean) => {
    const { user } = this.state;
    if (user) {
      try {
        if (!this.state.networkConnected) {
          throw new Error("Network is offline - cannot perform update now");
        }

        await updateUser(user);
        await setOfflineUpdatesFlagState({ shouldProcessRequests: false });
        /**
         * Alert the user if offline updates were just saved.
         */
        if (offlineFlag) {
          this.setToastMessage("Offline updates saved successfully!");
        }
      } catch (err) {
        await setOfflineUpdatesFlagState({ shouldProcessRequests: true });
      }
    }

    this.serializeAndPersistUser();
  };

  serializeAndPersistUser = async () => {
    if (this.state.user) {
      await saveUserToAsyncStorage(this.state.user);
    }
  };

  setupUserSessionFromPersistedUserData = async (persistedUser: User) => {
    if (persistedUser) {
      this.setState(
        {
          loading: false,
          transparentLoading: false,
          user: persistedUser,
        },
        async () => {
          await this.maybeHandleOfflineUpdates();
          this.fetchExistingUser(persistedUser);
        },
      );
    }
  };

  fetchExistingUser = async (maybePersistedUser: User) => {
    if (this.state.networkConnected) {
      const user = await getUser(maybePersistedUser.uuid);
      if (user) {
        this.setState(
          {
            user: transformUserJson(user),
          },
          this.setupPushToken,
        );
      }
    }
  };

  setupPushToken = async () => {
    /**
     * Try to register this device for push notifications if the
     * user doesn't have a token setup yet.
     */
    if (this.state.user && this.state.user.push_token === "") {
      const token = await registerForPushNotificationsAsync();
      this.handleUpdateUserFields({
        push_token: token,
      });
    }
  };

  handleUpdateUserSettingsField = (
    data: Partial<UserSettings>,
    optionalSuccessCallback?: (args?: any) => any,
  ) => {
    const { user } = this.state;
    if (user) {
      const updatedSettings = {
        ...user.settings,
        ...data,
      };
      const updatedUser = {
        ...user,
        settings: updatedSettings,
      };
      this.setState(
        {
          user: updatedUser,
        },
        () => {
          if (typeof optionalSuccessCallback === "function") {
            optionalSuccessCallback();
          }
          this.performUserUpdate();
        },
      );
    }
  };

  handleUpdateUserFields = (
    data: Partial<User>,
    optionalSuccessCallback?: (args?: any) => any,
  ) => {
    const { user } = this.state;
    if (user) {
      this.setState(
        {
          user: {
            ...user,
            ...data,
          },
        },
        () => {
          if (typeof optionalSuccessCallback === "function") {
            optionalSuccessCallback();
          }
          this.performUserUpdate();
        },
      );
    }
  };

  mapUserToAppFields = () => {
    /**
     * Map these user level values directly to flatten the state
     * hierarchy to make accessing the fields easy in child
     * components.
     */
    const { user } = this.state;
    if (user) {
      return {
        experience: user.experience_points,
        disableAudio: user.settings.disable_audio,
        autoProceedQuestion: user.settings.auto_proceed_question,
        userScoreStatus: user.score_history,
        languageSetting: user.settings.language_setting,
        appDifficultySetting: user.settings.app_difficulty_setting,
      };
    } else {
      return {
        experience: 0,
        disableAudio: false,
        autoProceedQuestion: false,
        userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
        languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
        appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
      };
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

  navigateToRoute = (routeName: ROUTE_NAMES) => {
    const navigationAction = NavigationActions.navigate({
      routeName,
    });

    if (this.navigationRef) {
      this.navigationRef.dispatch(navigationAction);
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

  render(): JSX.Element | null {
    const {
      user,
      error,
      loading,
      lessons,
      updating,
      firstTimeUser,
      wordDictionary,
      updateAvailable,
      networkConnected,
      transparentLoading,
    } = this.state;
    if (error) {
      return <ErrorComponent />;
    } else if (updating) {
      return <LoadingComponent />;
    } else if (loading) {
      return null;
    }

    const {
      disableAudio,
      autoProceedQuestion,
      experience,
      userScoreStatus,
      languageSetting,
      appDifficultySetting,
    } = this.mapUserToAppFields();

    /**
     * Define the GlobalStateProvider values:
     */
    const ProviderValues = {
      user,
      lessons,
      experience,
      disableAudio,
      wordDictionary,
      updateAvailable,
      networkConnected,
      languageSetting,
      userScoreStatus,
      autoProceedQuestion,
      appDifficultySetting,
      setLessonScore: this.setLessonScore,
      setToastMessage: this.setToastMessage,
      handleUpdateApp: this.handleUpdateApp,
      handleResetScores: this.handleResetScores,
      handleSwitchLanguage: this.handleSwitchLanguage,
      updateExperiencePoints: this.updateExperiencePoints,
      handleUpdateUserSettingsField: this.handleUpdateUserSettingsField,
    };

    return (
      <View style={{ flex: 1 }}>
        {transparentLoading && <TransparentLoadingComponent />}
        <CustomToast
          close={this.clearToast}
          message={this.state.toastMessage}
        />
        <GlobalContext.Provider value={ProviderValues}>
          <SoundRecordingProvider disableAudio={disableAudio}>
            <RenderAppOnce
              firstTimeUser={firstTimeUser}
              assignNavigatorRef={this.assignNavRef}
            />
          </SoundRecordingProvider>
        </GlobalContext.Provider>
      </View>
    );
  }

  initializeAppState = async () => {
    /**
     * Fetch lessons
     */
    const lessons = fetchLessonSet();
    const wordDictionary = createWordDictionaryFromLessons(lessons);
    this.setState(
      {
        lessons,
        wordDictionary,
      },
      this.initializeUserSession,
    );
  };

  initializeUserSession = async () => {
    const maybePersistedUser = await getPersistedUser();
    if (maybePersistedUser) {
      this.setupUserSessionFromPersistedUserData(maybePersistedUser);
    } else {
      this.handleInitialUserCreation();
    }
  };

  handleInitialUserCreation = async () => {
    const pushToken = await registerForPushNotificationsAsync();
    const userResult = await createUser({ push_token: pushToken });
    if (userResult) {
      this.setState(
        {
          loading: false,
          firstTimeUser: true,
          user: transformUserJson(userResult),
        },
        this.serializeAndPersistUser,
      );
    } else {
      this.setState({ loading: false, user: undefined, error: true });
    }
  };

  updateExperiencePoints = (experiencePoints: number) => {
    if (this.state.user) {
      const { experience_points: experience } = this.state.user;
      const updatedExperience = experience + experiencePoints;
      this.handleUpdateUserFields({
        experience_points: updatedExperience,
      });
    }
  };

  setLessonScore = async (
    updatedScoreStatus: ScoreStatus,
    lessonExperience: number,
  ) => {
    if (this.state.user) {
      const { experience_points: experience } = this.state.user;
      const updatedExperience = experience + lessonExperience;
      this.handleUpdateUserFields({
        score_history: updatedScoreStatus,
        experience_points: updatedExperience,
      });
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
          this.handleUpdateUserFields(
            {
              experience_points: 0,
              score_history: MOCKS.DEFAULT_SCORE_STATE,
            },
            () => this.setToastMessage("Scores reset!"),
          );
        }, 1250);
      },
    );
  };

  handleSwitchLanguage = () => {
    const { user } = this.state;
    if (user) {
      const { language_setting: languageSetting } = user.settings;
      const alternate = getAlternateLanguageSetting(languageSetting);

      Alert.alert(
        `Your current setting is ${formatUserLanguageSetting(languageSetting)}`,
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
            onPress: () => this.switchLanguage(languageSetting),
          },
        ],
        { cancelable: false },
      );
    }
  };

  switchLanguage = (setting: APP_LANGUAGE_SETTING) => {
    const setLanguage = (languageSetting: APP_LANGUAGE_SETTING) => {
      return this.handleUpdateUserSettingsField(
        {
          language_setting: languageSetting,
        },
        () => {
          this.setToastMessage(
            `Language set to ${formatUserLanguageSetting(languageSetting)}`,
          );
        },
      );
    };

    switch (setting) {
      case APP_LANGUAGE_SETTING.SIMPLIFIED:
        return setLanguage(APP_LANGUAGE_SETTING.TRADITIONAL);
      case APP_LANGUAGE_SETTING.TRADITIONAL:
        return setLanguage(APP_LANGUAGE_SETTING.SIMPLIFIED);
      default:
        console.log(`Unknown language setting received: ${setting}`);
        return setLanguage(APP_LANGUAGE_SETTING.SIMPLIFIED);
    }
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
  firstTimeUser: boolean;
  assignNavigatorRef: (ref: any) => void;
}

// tslint:disable-next-line
class RenderAppOnce extends React.Component<RenderAppOnceProps, {}> {
  shouldComponentUpdate(_: RenderAppOnceProps): boolean {
    return false;
  }

  render(): JSX.Element {
    const AppNavigator = createAppNavigator(this.props.firstTimeUser);
    const Nav = createAppContainer(AppNavigator);
    return <Nav ref={this.props.assignNavigatorRef} />;
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default RootContainer;
