import glamorous from "glamorous-native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  Button,
  Screen,
  ScreenBottom,
  ScreenTop,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import { WebBrowser } from "expo";

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
            <Bold style={{ fontSize: 22 }}>Welcome to 天天吉！</Bold>
          </DescriptionText>
          <DescriptionText>
            We are excited you are learning Chinese! We're here to make that
            easy and fun. This app is free to use and we collect no personal
            data other than some metrics on app usage.
          </DescriptionText>
          <DescriptionText>
            First we want to give you a quick introduction to Chinese and how
            this app works as a learning tool, and then we will get out of your
            way and let you start studying! Good luck!
          </DescriptionText>
          <DescriptionText style={{ width: "80%" }}>
            By pressing Next I confirm I have read and agree to the app{" "}
            <LinkText onPress={this.openPrivacyPolicyLink}>
              Privacy Policy
            </LinkText>
            .
          </DescriptionText>
        </ScreenTop>
        <ScreenBottom style={{ flex: 1 }}>
          <Button onPress={this.handleNavigate}>Next!</Button>
        </ScreenBottom>
      </Screen>
    );
  }

  handleNavigate = () => {
    this.props.navigation.navigate(ROUTE_NAMES.INTRO);
  };

  openPrivacyPolicyLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://github.com/bonham000/everyday-luck-app/blob/master/PRIVACY_POLICY.md",
      );
    } catch (_) {
      return;
    }
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

const LinkText = glamorous.text({
  fontSize: 16,
  marginTop: 22,
  fontWeight: "500",
  color: COLORS.primaryBlue,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default WelcomeScreenComponent;
