import glamorous from "glamorous-native";
import React from "react";
import { AppState, BackHandler, View } from "react-native";
import { Text } from "react-native-paper";

import createAppNavigator from "./NavigatorConfig";

interface IState {
  appState: string;
  tryingToCloseApp: boolean;
}

export default class NotesApp extends React.Component<{}, IState> {
  timeout: any = null;
  navigationRef: any = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      tryingToCloseApp: false,
    };
  }

  async componentDidMount(): Promise<void> {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.canCloseApp()) {
        if (!this.state.tryingToCloseApp) {
          this.activateTemporaryCloseState();
          return true;
        } else {
          return BackHandler.exitApp();
        }
      }

      return false;
    });
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener("hardwareBackPress", () => {
      return;
    });
  }

  render(): JSX.Element | null {
    return (
      <View style={{ flex: 1 }}>
        {this.state.tryingToCloseApp ? <CloseWarning /> : null}
        <AppPureComponent assignNavigatorRef={this.assignNavRef} />
      </View>
    );
  }

  assignNavRef = (ref: any) => {
    // @ts-ignore
    this.navigationRef = ref;
  };

  activateTemporaryCloseState = () => {
    this.setState(
      {
        tryingToCloseApp: true,
      },
      () => {
        this.timeout = setTimeout(() => {
          this.setState({
            tryingToCloseApp: false,
          });
        }, 2000);
      },
    );
  };

  canCloseApp = () => {
    try {
      return this.navigationRef.state.nav.routes[0].routes.length === 1;
    } catch (_) {
      return true;
    }
  };
}

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
    return <AppNavigator ref={this.props.assignNavigatorRef} />;
  }
}

const CloseWarning = () => (
  <BarContainer>
    <Bar>
      <Text style={{ color: "white", fontSize: 18 }}>
        Press again to close app ✌
      </Text>
    </Bar>
  </BarContainer>
);

const BarContainer = glamorous.view({
  height: 50,
  zIndex: 25,
  marginTop: 42,
  width: "100%",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
});

const Bar = glamorous.view({
  height: 48,
  width: "90%",
  borderRadius: 3,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(45,45,45,0.91)",
});
