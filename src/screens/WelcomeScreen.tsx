import glamorous from "glamorous-native";
import React from "react";
import { Button } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  ButtonStyles,
  Screen,
  ScreenBottom,
  ScreenTop,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class WelcomeScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Screen>
        <ScreenTop style={{ alignItems: "center", justifyContent: "center" }}>
          <DescriptionText>
            <Bold>Welcome! 大家好！</Bold>
          </DescriptionText>
          <DescriptionText>
            We are excited you are learning Chinese! We're here to make that
            easy and fun.
          </DescriptionText>
          <DescriptionText>
            First we want to give you a quick introduction to the language and
            how this app works as a learning tool, and then we will get out of
            your way and let you start studying! Good luck!
          </DescriptionText>
        </ScreenTop>
        <ScreenBottom>
          <Button
            dark
            mode="contained"
            style={ButtonStyles}
            onPress={this.handleNavigate}
          >
            Next!
          </Button>
        </ScreenBottom>
      </Screen>
    );
  }

  handleNavigate = () => {
    this.props.navigation.navigate(ROUTE_NAMES.INTRO);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const DescriptionText = glamorous.text({
  marginTop: 18,
  fontSize: 18,
  width: "90%",
  fontWeight: "400",
  textAlign: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default WelcomeScreenComponent;
