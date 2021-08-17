import { ThemeProvider } from "@emotion/react";
import * as Updates from "expo-updates";
import React from "react";
import {
  Alert,
  AppState,
  BackHandler,
  Clipboard,
  Platform,
  StatusBar,
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
  ToastMessageArgs,
  UserSettings,
} from "@src/providers/GlobalStateContext";
import {
  APP_THEME,
  GlobalStateValues,
} from "@src/providers/GlobalStateProvider";
import SoundRecordingProvider from "@src/providers/SoundRecordingProvider";
import { sendContactRequest } from "@src/tools/api";
import {
  getBookmarkWordList,
  getCustomWordStudyList,
  getFailedWordList,
  getPersistedUser,
  saveUserToAsyncStorage,
} from "@src/tools/async-store";
import { ContentList, User } from "@src/tools/types";
import {
  createWordDictionaryFromLessons,
  fetchLessonSet,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
  isEmailValid,
} from "@src/tools/utils";
import MOCKS, {
  BOOKMARKED_WORD_LIST_TITLE,
  CUSTOM_WORD_LIST_TITLE,
  FAILED_WORD_LIST_TITLE,
  getNewDefaultUser,
} from "@tests/mocks";
import { ListScoreSet } from "./lessons";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
}

const TOAST_TIMEOUT = 5000; /* 5 seconds */

const theme = {
  type: "dark",
};

export type NativeStyleTheme = typeof theme;

export interface NativeStyleThemeProps {
  theme: NativeStyleTheme;
}

/** ========================================================================
 * Root Container Base Component
 * =========================================================================
 */

// tslint:disable-next-line
class RootContainerBase<Props> extends React.Component<Props, IState> {
  timeout: number | null = null;
  navigationRef: any = null;

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
      appState: AppState.currentState,
    };
  }

  handleAppForegroundingEvent = () => {
    this.checkForAppUpdate();
  };

  performUserUpdate = async () => {
    this.serializeAndPersistUser();
  };

  serializeAndPersistUser = async () => {
    if (this.state.user) {
      await saveUserToAsyncStorage(this.state.user);
    }
  };

  setupUserSessionFromPersistedUserData = async (persistedUser: User) => {
    if (persistedUser) {
      this.setState({
        loading: false,
        user: persistedUser,
        transparentLoading: false,
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
        appTheme: user.settings.app_theme,
        experience: user.experience_points,
        userScoreStatus: user.score_history,
        disableAudio: user.settings.disable_audio,
        quizCacheSet: user.settings.quizCacheSet || {},
        languageSetting: user.settings.language_setting,
        autoProceedQuestion: user.settings.auto_proceed_question,
        appDifficultySetting: user.settings.app_difficulty_setting,
      };
    } else {
      return {
        appTheme: "light",
        experience: 100,
        quizCacheSet: {},
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
          Updates.reloadAsync();
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

  copyToClipboard = (text: string, shouldToast = true) => {
    try {
      Clipboard.setString(text);
      if (shouldToast) {
        this.setToastMessage(`${text} copied!`);
      }
    } catch (_) {
      return;
    }
  };

  handleSendContactEmail = (
    contactEmail: string,
    message: string,
    successCallback?: () => void,
  ) => {
    if (message === "") {
      return this.setToastMessage("Please enter a message");
    } else if (contactEmail === "" || !isEmailValid(contactEmail)) {
      return this.setToastMessage("Please enter a valid email address");
    } else {
      this.setState(
        {
          transparentLoading: true,
        },
        async () => {
          await sendContactRequest(contactEmail, message);
          this.setState(
            {
              transparentLoading: false,
            },
            () => {
              this.setToastMessage(
                "Message sent, thank you for the feedback!!!",
              );
            },
          );
        },
      );
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
     * Manage state to assign a toast warning if user tries to
     * press the back button when it will close the app. Show them
     * a toast and allow them to press again to close the app.
     */
    BackHandler.addEventListener(
      "hardwareBackPress",
      (): any => {
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
      },
    );

    /**
     * Check for updates when app is first opened.
     */
    this.checkForAppUpdate();
  }

  componentWillUnmount(): void {
    /**
     * Remove listeners and clear any existing timeout.
     */
    BackHandler.removeEventListener(
      "hardwareBackPress",
      (): any => {
        return;
      },
    );

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
      appTheme,
      experience,
      disableAudio,
      quizCacheSet,
      userScoreStatus,
      languageSetting,
      autoProceedQuestion,
      appDifficultySetting,
    } = this.mapUserToAppFields();

    /**
     * Define the GlobalStateProvider values:
     */
    const ProviderValues = {
      user,
      lessons,
      appTheme,
      experience,
      disableAudio,
      quizCacheSet,
      wordDictionary,
      updateAvailable,
      languageSetting,
      userScoreStatus,
      autoProceedQuestion,
      appDifficultySetting,
      toggleAppTheme: this.toggleAppTheme,
      setLessonScore: this.setLessonScore,
      setToastMessage: this.setToastMessage,
      copyToClipboard: this.copyToClipboard,
      handleUpdateApp: this.handleUpdateApp,
      handleResetScores: this.handleResetScores,
      reloadLessonSet: this.handleReloadLessonSet,
      handleSwitchLanguage: this.handleSwitchLanguage,
      updateExperiencePoints: this.updateExperiencePoints,
      handleSendContactEmail: this.handleSendContactEmail,
      handleUpdateUserSettingsField: this.handleUpdateUserSettingsField,
    };

    const statusBarStyle =
      Platform.OS === "android"
        ? "light-content"
        : appTheme === "dark"
        ? "light-content"
        : "dark-content";

    return (
      <ThemeProvider theme={{ type: appTheme }}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle={statusBarStyle} />
          {transparentLoading && <TransparentLoadingComponent />}
          <CustomToast
            close={this.clearToast}
            message={this.state.toastMessage}
          />
          <GlobalContext.Provider value={ProviderValues}>
            <SoundRecordingProvider disableAudio={disableAudio}>
              <RenderAppOnce
                theme={appTheme as APP_THEME}
                firstTimeUser={firstTimeUser}
                assignNavigatorRef={this.assignNavRef}
              />
            </SoundRecordingProvider>
          </GlobalContext.Provider>
        </View>
      </ThemeProvider>
    );
  }

  initializeAppState = async () => {
    /**
     * Fetch lessons
     */
    const lessons = await this.getLessonSet();
    const wordDictionary = createWordDictionaryFromLessons(lessons);
    this.setState(
      {
        lessons,
        wordDictionary,
      },
      this.initializeUserSession,
    );
  };

  handleReloadLessonSet = async () => {
    const lessons = await this.getLessonSet();
    this.setState({ lessons });
  };

  getLessonSet = async () => {
    let hsk = fetchLessonSet();

    // Add the custom word list to the lessons, if it exists.
    const customWordList = await getCustomWordStudyList();
    const bookmarkWordList = await getBookmarkWordList();
    const failedWordList = await getFailedWordList();

    if (customWordList.length > 0) {
      const customWordListLesson: ContentList = {
        type: "Custom Word List",
        id: "custom-word-list",
        locked: false,
        title: CUSTOM_WORD_LIST_TITLE,
        content: customWordList,
      };

      hsk = hsk.concat(customWordListLesson);
    }

    if (bookmarkWordList.length > 0) {
      const bookmarkedListLesson: ContentList = {
        type: "Bookmarked Word List",
        id: "bookmarked-word-list",
        locked: false,
        title: BOOKMARKED_WORD_LIST_TITLE,
        content: bookmarkWordList,
      };
      hsk = hsk.concat(bookmarkedListLesson);
    }

    if (failedWordList.length > 0) {
      const failedWordListLesson: ContentList = {
        type: "Failed Word List",
        id: "failed-word-list",
        locked: false,
        title: FAILED_WORD_LIST_TITLE,
        content: failedWordList,
      };
      hsk = hsk.concat(failedWordListLesson);
    }

    return hsk;
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
    const defaultUser = getNewDefaultUser();
    this.setState({ loading: false, error: false, user: defaultUser });
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
    updatedScoreStatus: ListScoreSet,
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

  toggleAppTheme = () => {
    const { user } = this.state;
    if (user) {
      const newTheme = user.settings.app_theme === "dark" ? "light" : "dark";
      return this.handleUpdateUserSettingsField({
        app_theme: newTheme,
      });
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
  theme: APP_THEME;
  firstTimeUser: boolean;
  assignNavigatorRef: (ref: any) => void;
}

// tslint:disable-next-line
class RenderAppOnce extends React.Component<
  RenderAppOnceProps,
  { navigator: any }
> {
  constructor(props: RenderAppOnceProps) {
    super(props);

    this.state = {
      navigator: null,
    };
  }

  componentDidMount(): void {
    // Create the navigator once on mount so it doesn't get re-created on prop changes...
    const AppNavigator = createAppNavigator(
      this.props.firstTimeUser,
      this.props.theme,
    );
    const Nav = createAppContainer(AppNavigator);
    this.setState({ navigator: Nav });
  }

  render(): JSX.Element | null {
    const Nav = this.state.navigator;
    if (Nav) {
      return (
        <SafeAreaProvider style={{ backgroundColor: "black" }}>
          <Nav theme={this.props.theme} ref={this.props.assignNavigatorRef} />
        </SafeAreaProvider>
      );
    }

    return null;
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default RootContainer;
