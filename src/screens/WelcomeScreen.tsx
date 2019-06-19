import { WebBrowser } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { Switch } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  Button,
  LineBreak,
  Screen,
  ScreenBottom,
  ScreenTop,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  agreement: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class WelcomeScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      agreement: false,
    };
  }

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
        </ScreenTop>
        <ScreenBottom style={{ flex: 2 }}>
          <Button
            onPress={this.handleNavigate}
            style={{ marginTop: 8, marginBottom: 8 }}
          >
            Next!
          </Button>
          <LineBreak />
          {this.renderTermsAgreement()}
        </ScreenBottom>
      </Screen>
    );
  }

  renderTermsAgreement = () => {
    return (
      <AgreementContainer>
        <Switch
          color={COLORS.primaryBlue}
          value={this.state.agreement}
          onValueChange={this.handleDocumentsAgreement}
        />
        <TermsText>
          I confirm I have read and agree to the app's{" "}
          <LinkText onPress={this.openDocumentsLink("PRIVACY_POLICY")}>
            Privacy Policy
          </LinkText>{" "}
          and{" "}
          <LinkText onPress={this.openDocumentsLink("TERMS_OF_USE")}>
            Terms of Use
          </LinkText>
          .
        </TermsText>
      </AgreementContainer>
    );
  };

  handleNavigate = () => {
    this.props.navigation.navigate(ROUTE_NAMES.INTRO);
  };

  handleDocumentsAgreement = () => {
    this.setState(prevState => ({
      agreement: !prevState.agreement,
    }));
  };

  openDocumentsLink = (
    document: "PRIVACY_POLICY" | "TERMS_OF_USE",
  ) => async () => {
    const base = "https://github.com/bonham000/everyday-luck-app/blob/master/";
    const url = `${base}${document}.md`;
    try {
      await WebBrowser.openBrowserAsync(url);
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

const TermsText = glamorous.text({
  marginLeft: 10,
  width: "75%",
  fontSize: 14,
  fontWeight: "400",
  textAlign: "center",
});

const LinkText = glamorous.text({
  fontWeight: "500",
  color: COLORS.primaryBlue,
});

const AgreementContainer = glamorous.view({
  width: "90%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default WelcomeScreenComponent;
