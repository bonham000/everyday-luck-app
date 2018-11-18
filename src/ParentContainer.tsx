import React from "react";
import { AppState, View } from "react-native";

import AppContext from "./AppContext";
import createAppNavigator from "./NavigatorConfig";

interface IState {
  appState: string;
}

export default class NotesApp extends React.Component<{}, IState> {
  timeout: any = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      appState: AppState.currentState,
    };
  }

  async componentDidMount(): Promise<void> {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount(): void {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  render(): JSX.Element | null {
    const AppNavigator = createAppNavigator();
    return (
      <AppContext.Provider value={{}}>
        <View style={{ flex: 1 }}>
          <AppNavigator />
        </View>
      </AppContext.Provider>
    );
  }

  handleAppStateChange = (nextAppState: string) => {
    this.setState({ appState: nextAppState });
  };
}
