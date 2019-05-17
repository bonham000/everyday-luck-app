import glamorous from "glamorous-native";
import React from "react";
import { Image, Keyboard, TouchableOpacity, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { logoutLocalUser } from "@src/tools/store";
import { formatUserLanguageSetting, resetNavigation } from "@src/tools/utils";

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

class SideMenuComponent extends React.Component<IProps, {}> {
  componentDidUpdate(prevProps: IProps): void {
    if (
      this.getDrawerStateFromProps(this.props) &&
      !this.getDrawerStateFromProps(prevProps)
    ) {
      Keyboard.dismiss();
    }
  }

  render(): JSX.Element {
    const { user, languageSetting } = this.props;
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
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.TRANSLATION)}>
          📔
          {"  "}
          Translation Tool
        </Item>
        <Item onPress={this.handleSetLanguageOptions}>
          🎗
          {"  "}
          Set Language
        </Item>
        <Item onPress={this.handleResetScores}>
          🗃
          {"  "}
          Reset Scores
        </Item>
        <Item onPress={this.handleLogout}>🎡 Logout</Item>
        {user && (
          <Item
            style={{ position: "absolute", bottom: 125, left: 6, fontSize: 12 }}
          >
            <Bold>Name:</Bold> {user.name}
          </Item>
        )}
        <Item
          style={{ position: "absolute", bottom: 95, left: 6, fontSize: 12 }}
        >
          <Bold>Experience Points:</Bold> {this.props.experience}
        </Item>
        <Item
          style={{ position: "absolute", bottom: 65, left: 6, fontSize: 12 }}
        >
          <Bold>Language:</Bold> {formatUserLanguageSetting(languageSetting)}
        </Item>
      </SafeAreaView>
    );
  }

  handleSetLanguageOptions = () => {
    this.props.handleSwitchLanguage(this.props.navigation.closeDrawer);
  };

  handleResetScores = () => {
    this.props.handleResetScores();
  };

  handleLogout = async () => {
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

const Item = ({ children, onPress, style }: any) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <ItemText>{children}</ItemText>
  </TouchableOpacity>
);

const ItemText = glamorous.text({
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

export default withGlobalState(SideMenuComponent);
