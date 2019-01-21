import { Updates } from "expo";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  View,
} from "react-native";
import { SinglePickerMaterialDialog } from "react-native-material-dialog";
import { createAppContainer } from "react-navigation";

import { CustomToast } from "@src/components/ToastProvider";
import { COLORS } from "@src/constants/Colors";
import GlobalContext, {
  initialLessonScoreState,
  LessonScoreType,
  ScoreStatus,
} from "@src/GlobalContext";
import createAppNavigator from "@src/NavigatorConfig";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IState {
  appState: string;
  toastMessage: string;
  updating: boolean;
  tryingToCloseApp: boolean;
  selectedLanguage: any;
  userScoreStatus: ScoreStatus;
  languageSelectionMenuOpen: boolean;
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
      appState: AppState.currentState,
      toastMessage: "",
      updating: false,
      tryingToCloseApp: false,
      languageSelectionMenuOpen: false,
      userScoreStatus: initialLessonScoreState,
      selectedLanguage: {
        value: 0,
        label: "Mandarin",
        selected: true,
      },
    };
  }

  async componentDidMount(): Promise<void> {
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
    if (this.state.updating) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <GlobalContext.Provider
          value={{
            setToastMessage: this.setToastMessage,
            openLanguageSelectionMenu: this.openLanguageSelectionMenu,
            selectedLanguage: this.state.selectedLanguage.label,
            setLessonScore: this.setLessonScore,
            userScoreStatus: this.state.userScoreStatus,
          }}
        >
          <CustomToast
            close={this.clearToast}
            message={this.state.toastMessage}
          />
          <SinglePickerMaterialDialog
            title={"Pick a language!"}
            items={["Mandarin", "Korean"].map((row, index) => ({
              value: index,
              label: row,
            }))}
            visible={this.state.languageSelectionMenuOpen}
            selectedItem={this.state.selectedLanguage}
            onCancel={this.closeLanguageSelectionMenu}
            onOk={this.handlePickLanguage}
          />
          <AppPureComponent assignNavigatorRef={this.assignNavRef} />
        </GlobalContext.Provider>
      </View>
    );
  }

  setLessonScore = (lessonIndex: number, lessonPassedType: LessonScoreType) => {
    console.log(lessonIndex, lessonPassedType);

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
      () => console.log(this.state.userScoreStatus),
    );
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

  openLanguageSelectionMenu = () => {
    this.setState({
      languageSelectionMenuOpen: true,
    });
  };

  closeLanguageSelectionMenu = () => {
    this.setState({
      languageSelectionMenuOpen: false,
    });
  };

  handlePickLanguage = (result: any) => {
    this.setState({ languageSelectionMenuOpen: false });
    this.setState({ selectedLanguage: result.selectedItem });
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
          "Confirm to update now.",
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
  { assignNavigatorRef: (ref: any) => void },
  {}
> {
  shouldComponentUpdate(_: any): boolean {
    return false;
  }

  render(): JSX.Element {
    const AppNavigator = createAppNavigator();
    const Nav = createAppContainer(AppNavigator);
    return <Nav ref={this.props.assignNavigatorRef} />;
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default RootContainer;
