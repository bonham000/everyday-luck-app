import { Asset, Updates } from "expo";
import React from "react";
import { Alert, AppState, BackHandler, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";

import LoadingComponent from "@src/components/LoadingComponent";
import { CustomToast } from "@src/components/ToastProvider";
import {
  addExperiencePoints,
  fetchLessonSet,
  getExistingUserScoresAsync,
  getUser,
  getUserExperience,
  resetUserScoresAsync,
  saveProgressToAsyncStorage,
  User,
} from "@src/content/store";
import { LessonSet } from "@src/content/types";
import GlobalContext, { LessonScoreType, ScoreStatus } from "@src/GlobalState";
import createAppNavigator from "@src/NavigatorConfig";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IState {
  user?: User;
  lessons?: LessonSet;
  error: boolean;
  loading: boolean;
  appState: string;
  toastMessage: string;
  updating: boolean;
  tryingToCloseApp: boolean;
  userScoreStatus: ScoreStatus;
  experience: number;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class RootContainer extends React.Component<{}, IState> {
  timeout: any = null;
  navigationRef: any = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      error: false,
      experience: 0,
      loading: true,
      appState: AppState.currentState,
      toastMessage: "",
      updating: false,
      tryingToCloseApp: false,
      userScoreStatus: [],
    };
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
      this.setState({
        loading: false,
        lessons,
        user: await getUser(),
        experience: await getUserExperience(),
        userScoreStatus: await getExistingUserScoresAsync(lessons),
      });
    }
  };

  async componentDidMount(): Promise<void> {
    this.getInitialScoreState();

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
            () => this.setToastMessage("Press again to close app ✌"),
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
      error,
      updating,
      loading,
      user,
      lessons,
      experience,
      userScoreStatus,
    } = this.state;

    if (error) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Everything is broken... 🎭</Text>
        </View>
      );
    } else if (updating || loading) {
      return <LoadingComponent />;
    }

    return (
      <View style={{ flex: 1 }}>
        <GlobalContext.Provider
          value={{
            // @ts-ignore
            user,
            // @ts-ignore
            lessons,
            experience,
            userScoreStatus,
            onSignin: this.handleSignin,
            setLessonScore: this.setLessonScore,
            setToastMessage: this.setToastMessage,
            handleResetScores: this.handleResetScores,
          }}
        >
          <CustomToast
            close={this.clearToast}
            message={this.state.toastMessage}
          />
          <AppPureComponent
            userLoggedIn={Boolean(this.state.user)}
            assignNavigatorRef={this.assignNavRef}
          />
        </GlobalContext.Provider>
      </View>
    );
  }

  handleSignin = async () => {
    this.setState({
      user: await getUser(),
    });
  };

  setLessonScore = (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
    exp: number,
  ) => {
    const updatedScoreStatus = this.state.userScoreStatus.map(
      (status, index) => {
        if (index === lessonIndex) {
          return {
            ...status,
            [lessonPassedType]: true,
          };
        } else {
          return status;
        }
      },
    );

    this.setState(
      {
        userScoreStatus: updatedScoreStatus,
      },
      () => this.persistScore(exp),
    );
  };

  persistScore = async (exp: number) => {
    await saveProgressToAsyncStorage(this.state.userScoreStatus);
    const experience = await addExperiencePoints(exp);
    if (experience) {
      this.setState({ experience });
    }
  };

  assignNavRef = (ref: any) => {
    // tslint:disable-next-line
    this.navigationRef = ref;
  };

  clearTimer = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  abortTryingToClose = () => {
    this.setState({ tryingToCloseApp: false });
  };

  setToastMessage = (toastMessage: string): void => {
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
        }, 2000);
      },
    );
  };

  clearToast = () => {
    this.setState({
      toastMessage: "",
    });
  };

  handleResetScores = () => {
    Alert.alert(
      "Are you sure?",
      "All existing progress will be erased!",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.setState(
              {
                loading: true,
              },
              () => {
                // tslint:disable-next-line
                this.timeout = setTimeout(async () => {
                  await resetUserScoresAsync();
                  this.getInitialScoreState();
                }, 1250);
              },
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  canCloseApp = () => {
    try {
      return this.navigationRef.state.nav.routes[0].routes.length === 1;
    } catch (_) {
      return true;
    }
  };

  handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.checkForAppUpdate();
    }

    this.setState({ appState: nextAppState });
  };

  checkForAppUpdate = async (): Promise<void> => {
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        Alert.alert(
          "Update Available!",
          "Confirm to update now",
          [
            { text: "Cancel", onPress: () => null, style: "cancel" },
            { text: "OK", onPress: this.updateApp },
          ],
          { cancelable: false },
        );
      }
      // tslint:disable-next-line
    } catch (err) {}
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
}

/** ========================================================================
 * App Component
 * =========================================================================
 */

// tslint:disable-next-line
class AppPureComponent extends React.Component<
  { assignNavigatorRef: (ref: any) => void; userLoggedIn: boolean },
  {}
> {
  shouldComponentUpdate(_: any): boolean {
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
