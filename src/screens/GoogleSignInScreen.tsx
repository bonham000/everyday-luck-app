import { Google } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { Image } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import LoadingComponent from "@src/components/LoadingComponent";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/Routes";
import { saveUser } from "@src/content/store";
import CONFIG from "@src/tools/config";
import { resetNavigation } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
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

class GoogleSignInScreen extends React.Component<IProps, IState> {
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
      <Container>
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
      async () => {
        try {
          const result: Google.LogInResult = await Google.logInAsync({
            androidClientId: ANDROID_CLIENT_ID,
            iosClientId: IOS_CLIENT_ID,
            scopes: ["profile", "email"],
          });

          if (result.type === "success") {
            const { user } = result;
            await saveUser(user);
            this.props.navigation.dispatch(resetNavigation(ROUTE_NAMES.HOME));
          } else {
            this.setState({
              loading: false,
            });
          }
        } catch (err) {
          console.log(err);
          this.setState({
            loading: false,
            error: true,
          });
        }
      },
    );
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgb(231,237,240)",
});

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

export default GoogleSignInScreen;
