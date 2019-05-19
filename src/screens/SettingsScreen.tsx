import glamorous from "glamorous-native";
import React from "react";
import { Button, Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  loading: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class SettingsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render(): JSX.Element {
    return (
      <Container>
        <Button
          dark
          mode="contained"
          style={{
            marginTop: 30,
            minWidth: 215,
            backgroundColor: COLORS.primaryBlue,
          }}
          onPress={this.handleSetLanguageOptions}
        >
          Switch Language
        </Button>
      </Container>
    );
  }

  handleSetLanguageOptions = () => {
    this.props.handleSwitchLanguage(this.props.navigation.closeDrawer);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 75,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(SettingsScreen);
