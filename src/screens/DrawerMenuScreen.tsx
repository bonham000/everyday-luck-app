import glamorous from "glamorous-native";
import React from "react";
import { Image, Keyboard, ScrollView, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import { resetNavigation } from "@src/utils";

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
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <SafeAreaView
          style={{ flex: 1, paddingTop: 75 }}
          forceInset={{ top: "always", horizontal: "never" }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
              source={require("../../assets/icon.png")}
            />
          </View>
          <Item
            onPress={this.createNavigationHandler(ROUTE_NAMES.MANDARIN_QUIZ)}
          >
            🏮
            {"  "}
            Translation Quiz
          </Item>
          <Item onPress={this.createNavigationHandler(ROUTE_NAMES.FLASHCARDS)}>
            🎎
            {"  "}
            Mandarin Flashcards
          </Item>
          <Item onPress={this.createNavigationHandler(ROUTE_NAMES.VIEW_ALL)}>
            🍱
            {"  "}
            View All Content
          </Item>
          <Item onPress={this.createNavigationHandler(ROUTE_NAMES.ABOUT)}>
            🎋
            {"  "}
            About
          </Item>
        </SafeAreaView>
      </ScrollView>
    );
  }

  createNavigationHandler = (route: ROUTE_NAMES) => {
    return () => {
      this.props.navigation.dispatch(resetNavigation(route));
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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default DrawerMenuScreen;
