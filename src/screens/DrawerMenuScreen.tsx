import glamorous from "glamorous-native";
import React from "react";
import { Image, Keyboard, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import { logoutLocalUser } from "@src/api/store";
import GlobalStateProvider, {
  GlobalStateProps,
} from "@src/components/GlobalStateProvider";
import { ROUTE_NAMES } from "@src/constants/Routes";
import { resetNavigation } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class DrawerMenuScreen extends React.Component<IProps, {}> {
  componentDidUpdate(prevProps: IProps): void {
    if (
      this.getDrawerStateFromProps(this.props) &&
      !this.getDrawerStateFromProps(prevProps)
    ) {
      Keyboard.dismiss();
    }
  }

  render(): JSX.Element {
    const { user } = this.props;
    return (
      <SafeAreaView
        style={{ flex: 1, paddingTop: 75, paddingLeft: 6 }}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            resizeMode="contain"
            style={{ width: 100, height: 100 }}
            source={require("../assets/icon.png")}
          />
        </View>
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.ABOUT)}>
          🎋
          {"  "}
          About this App
        </Item>
        <Item onPress={this.resetScores}>
          🗃
          {"  "}
          Reset Scores
        </Item>
        <Item onPress={this.logout}>🎡 Logout</Item>
        {user && (
          <Item
            style={{ position: "absolute", bottom: 95, left: 6, fontSize: 12 }}
          >
            <Bold>Current user:</Bold> {user.name}
          </Item>
        )}
        <Item
          style={{ position: "absolute", bottom: 65, left: 6, fontSize: 12 }}
        >
          <Bold>Experience points:</Bold> {this.props.experience}
        </Item>
      </SafeAreaView>
    );
  }

  resetScores = () => {
    this.props.handleResetScores();
    this.props.navigation.closeDrawer();
  };

  logout = async () => {
    try {
      await logoutLocalUser();
      this.props.navigation.dispatch(resetNavigation(ROUTE_NAMES.SIGNIN));
    } catch (err) {
      console.log(err);
    }
  };

  createNavigationHandler = (route: ROUTE_NAMES) => {
    return () => {
      this.props.navigation.navigate(route);
    };
  };

  getDrawerStateFromProps = (props: IProps) => {
    try {
      // @ts-ignore
      return props.navigation.state.isDrawerOpen;
    } catch (err) {
      return false;
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Item = glamorous.text({
  fontSize: 16,
  marginTop: 45,
  marginLeft: 12,
});

const Bold = glamorous.text({
  fontWeight: "600",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default (props: any) => (
  <GlobalStateProvider {...props} Component={DrawerMenuScreen} />
);
