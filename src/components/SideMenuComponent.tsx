import Constants from "expo-constants";
import glamorous from "glamorous-native";
import React from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import { SMALL_DEVICE } from "@src/constants/Device";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { formatUserLanguageSetting } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

const ICON_DIMENSION = SMALL_DEVICE ? 60 : 100;

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
    const {
      experience,
      languageSetting,
      updateAvailable,
      handleUpdateApp,
    } = this.props;
    return (
      <SafeAreaView
        style={{ flex: 1, paddingTop: SMALL_DEVICE ? 35 : 75, paddingLeft: 6 }}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            resizeMode="contain"
            style={{ width: ICON_DIMENSION, height: ICON_DIMENSION }}
            source={require("../assets/icon.png")}
          />
        </View>
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.TRANSLATION)}>
          📔
          {"  "}
          Translate
        </Item>
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.SETTINGS)}>
          🔖
          {"  "}
          Settings
        </Item>
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.ACCOUNT)}>
          🗃 Account
        </Item>
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.CONTACT)}>
          👨‍💻 Contact
        </Item>
        <Item onPress={this.createNavigationHandler(ROUTE_NAMES.WELCOME)}>
          ⛱{"  "}
          About
        </Item>
        <BottomBlock>
          <SmallItem>
            <Bold>Experience Points:</Bold> {experience.toLocaleString()}
          </SmallItem>
          <SmallItem>
            <Bold>Language:</Bold> {formatUserLanguageSetting(languageSetting)}
          </SmallItem>
          <LineBreak />
          <SmallText style={{ fontSize: 14 }}>
            <Bold>Version:</Bold> {Constants.manifest.version}{" "}
            {updateAvailable ? (
              <React.Fragment>
                <SmallText style={{ fontSize: 14 }}>
                  <Bold>- </Bold>
                </SmallText>
                <LinkText onPress={handleUpdateApp}>Update App 🛰</LinkText>
              </React.Fragment>
            ) : (
              <SmallText style={{ fontSize: 14 }}>(latest)</SmallText>
            )}
          </SmallText>
        </BottomBlock>
      </SafeAreaView>
    );
  }

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

const BottomBlock = glamorous.view({
  left: 6,
  bottom: 0,
  height: 120,
  position: "absolute",
});

const Item = ({ children, onPress, style }: any) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <ItemText>{children}</ItemText>
  </TouchableOpacity>
);

const SmallItem = ({ children, onPress, style }: any) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <SmallText>{children}</SmallText>
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

const SmallText = glamorous.text({
  fontSize: 16,
  marginTop: 4,
  marginLeft: 12,
});

const LinkText = glamorous.text({
  fontSize: 14,
  fontWeight: "500",
  color: COLORS.primaryBlue,
});

const LineBreak = glamorous.view({
  width: "90%",
  marginTop: 12,
  marginLeft: 12,
  marginBottom: 6,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(SideMenuComponent);
