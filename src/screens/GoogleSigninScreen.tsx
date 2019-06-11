import { Google } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { Image } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import Sentry from "sentry-expo";

import { LoadingComponent } from "@src/components/LoadingComponent";
import { Container } from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import CONFIG from "@src/tools/config";
import { resetNavigation } from "@src/tools/navigation-utils";
import { GoogleSigninUser } from "@src/tools/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  loading: boolean;
  error: boolean;
}

const ANDROID_CLIENT_ID = CONFIG.ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = CONFIG.IOS_CLIENT_ID;

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class GoogleSigninScreenComponent extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: false,
      error: false,
    };
  }

  render(): JSX.Element {
    const { loading, error } = this.state;
    if (loading) {
      return <LoadingComponent />;
    }

    return (
      <Container style={{ justifyContent: "center" }}>
        <AppTitle>很多汉字</AppTitle>
        <AppSubtitle>"Hěnduō hànzì"</AppSubtitle>
        <DescriptionText>This is an app for learning Chinese</DescriptionText>
        <GoogleButtonContainer onPress={this.signin}>
          <GoogleIcon />
          <GoogleText>Sign in with Google</GoogleText>
        </GoogleButtonContainer>
        {error && (
          <ErrorText>Something didn't work... please try again</ErrorText>
        )}
      </Container>
    );
  }

  signin = async () => {
    this.setState(
      {
        loading: true,
      },
      this.handleSigninResult,
    );
  };

  handleSigninResult = async () => {
    try {
      /**
       * TODO: This includes access token data which can be used to authenticate
       * future requests.
       */
      const result: Google.LogInResult = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        const { user } = result;
        if (user.email) {
          await this.props.onSignin(user as GoogleSigninUser);
          this.props.navigation.dispatch(resetNavigation(ROUTE_NAMES.WELCOME));
        } else {
          throw new Error("No email provided!");
        }
      } else {
        throw new Error("Login failed, cancelled, or rejected");
      }
    } catch (err) {
      Sentry.captureException(err);
      this.setState({
        error: true,
        loading: false,
      });
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const AppTitle = glamorous.text({
  marginTop: -125,
  fontSize: 32,
  fontWeight: "bold",
});

const AppSubtitle = glamorous.text({
  marginTop: 16,
  fontSize: 20,
});

const DescriptionText = glamorous.text({
  marginTop: 25,
  marginBottom: 25,
  fontSize: 16,
});

const ErrorText = glamorous.text({
  marginTop: 25,
  fontSize: 16,
  color: COLORS.primaryRed,
});

const GoogleButtonContainer = glamorous.touchableOpacity({
  height: 50,
  width: 240,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 1,
  backgroundColor: "#4285f4",
});

const GoogleText = glamorous.text({
  color: "white",
  fontSize: 18,
  lineHeight: 48,
  fontWeight: "500",
  width: 191,
  textAlign: "center",
});

const IconContainer = glamorous.view({
  width: 47,
  height: 47,
  marginLeft: 1,
  backgroundColor: "#fff",
  borderRadius: 1,
  justifyContent: "center",
  alignItems: "center",
});

const GoogleIcon = () => (
  <IconContainer>
    <Image
      style={{
        width: 25,
        height: 25,
      }}
      source={require("@src/assets/google_icon.png")}
    />
  </IconContainer>
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(GoogleSigninScreenComponent);
