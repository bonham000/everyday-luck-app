import styled from "@emotion/native";
import { WebBrowser } from "expo";
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
  ScrollContainer,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  getUserDocumentsAgreementsFlag,
  setUserDocumentsAgreementsFlag,
} from "@src/tools/async-store";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  loading: boolean;
  agreement: boolean;
  hasPreviouslyAgreed: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class WelcomeScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: true,
      agreement: false,
      hasPreviouslyAgreed: false,
    };
  }

  async componentDidMount(): Promise<void> {
    const agreed = await getUserDocumentsAgreementsFlag();
    this.setState({
      loading: false,
      agreement: agreed,
      hasPreviouslyAgreed: agreed,
    });
  }

  render(): JSX.Element | null {
    if (this.state.loading) {
      return null;
    }

    return (
      <Screen>
        <ScreenTop>
          <ScrollContainer style={{ paddingTop: 5 }}>
            <DescriptionText>
              <Bold style={{ fontSize: 26 }}>Welcome to 天天吉 🍀</Bold>
            </DescriptionText>
            <DescriptionText>
              We are excited you are learning Chinese! We're here to make that
              easy and fun. This app is free to use and we collect no personal
              data.
            </DescriptionText>
            <DescriptionText>
              First we want to give you a quick introduction to Chinese and how
              this app works. Then we will get out of your way and let you start
              studying!
            </DescriptionText>
            <DescriptionText>
              <Bold>Good luck!</Bold>
            </DescriptionText>
            {this.renderTermsAgreement()}
          </ScrollContainer>
        </ScreenTop>
        <ScreenBottom style={{ flex: 1 }}>
          <Button
            onPress={this.handleNavigateNext}
            style={{
              marginTop: 8,
              marginBottom: 8,
              backgroundColor: this.state.agreement
                ? COLORS.primaryBlue
                : COLORS.lightDark,
            }}
          >
            Next!
          </Button>
        </ScreenBottom>
      </Screen>
    );
  }

  renderTermsAgreement = () => {
    if (this.state.hasPreviouslyAgreed) {
      return null;
    } else {
      return (
        <React.Fragment>
          <LineBreak />
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
        </React.Fragment>
      );
    }
  };

  handleNavigateNext = async () => {
    const { agreement } = this.state;
    if (!agreement) {
      return this.props.setToastMessage(
        "Please agree to the Terms of Use and Privacy Policy",
      );
    } else {
      await setUserDocumentsAgreementsFlag(agreement);
      this.props.navigation.navigate(ROUTE_NAMES.INTRO);
    }
  };

  handleDocumentsAgreement = () => {
    this.setState(prevState => ({
      agreement: !prevState.agreement,
    }));
  };

  openDocumentsLink = (
    document: "PRIVACY_POLICY" | "TERMS_OF_USE",
  ) => async () => {
    const base =
      "https://github.com/bonham000/everyday-luck-app/blob/master/documents/";
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

const DescriptionText = styled.Text({
  marginTop: 18,
  fontSize: 18,
  width: "90%",
  fontWeight: "400",
  textAlign: "center",
});

const TermsText = styled.Text({
  marginLeft: 10,
  width: "75%",
  fontSize: 14,
  fontWeight: "400",
  textAlign: "center",
});

const LinkText = styled.Text({
  fontWeight: "500",
  color: COLORS.primaryBlue,
});

const AgreementContainer = styled.View({
  width: "90%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(WelcomeScreenComponent);
