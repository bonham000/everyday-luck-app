import glamorous from "glamorous-native";
import React from "react";
import { Image, Keyboard, ScrollView, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import GlobalContextProvider, {
  GlobalContextProps,
} from "@src/components/GlobalContextProvider";
import { ROUTE_NAMES } from "@src/constants/Routes";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalContextProps {
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
          <Item onPress={this.handleSwitchLanguage}>
            🥢
            {"  "}
            Switch Language
          </Item>
        </SafeAreaView>
      </ScrollView>
    );
  }

  handleSwitchLanguage = () => {
    this.props.openLanguageSelectionMenu();
    this.props.navigation.closeDrawer();
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
  fontWeight: "500",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default (props: any) => (
  <GlobalContextProvider {...props} Component={DrawerMenuScreen} />
);
