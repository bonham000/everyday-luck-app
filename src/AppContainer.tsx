import React from "react";
import { AppState, BackHandler, View } from "react-native";
import { SinglePickerMaterialDialog } from "react-native-material-dialog";
import { createAppContainer } from "react-navigation";

import AppContext from "@src/AppContext";
import { CustomToast } from "@src/components/ToastProvider";
import createAppNavigator from "@src/NavigatorConfig";
import { getLanguageContent } from "@src/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IState {
  appState: string;
  toastMessage: string;
  tryingToCloseApp: boolean;
  selectedLanguage: any;
  languageSelectionMenuOpen: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class AppContainer extends React.Component<{}, IState> {
  timeout: any = null;
  navigationRef: any = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      toastMessage: "",
      tryingToCloseApp: false,
      languageSelectionMenuOpen: false,
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
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener("hardwareBackPress", () => {
      return;
    });

    this.clearTimer();
  }

  render(): JSX.Element | null {
    return (
      <View style={{ flex: 1 }}>
        <AppContext.Provider
          value={{
            setToastMessage: this.setToastMessage,
            openLanguageSelectionMenu: this.openLanguageSelectionMenu,
            selectedLanguage: getLanguageContent(
              this.state.selectedLanguage.label,
            ),
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
        </AppContext.Provider>
      </View>
    );
  }

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
  shouldComponentUpdate(nextProps: any): boolean {
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

export default AppContainer;
