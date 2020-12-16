import styled from "@emotion/native";
import Constants from "expo-constants";
import React from "react";
import { Image, Keyboard, TouchableOpacity, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import { SMALL_DEVICE } from "@src/constants/Device";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { formatUserLanguageSetting } from "@src/tools/utils";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStyleThemeProps } from "@src/AppContainer";

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
      <ThemedSafeAreaView
        style={{
          flex: 1,
          paddingLeft: 6,
          justifyContent: "space-evenly",
          paddingTop: SMALL_DEVICE ? 35 : 75,
        }}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{ width: ICON_DIMENSION, height: ICON_DIMENSION }}
            source={require("../assets/icon.png")}
          />
        </View>
        <View style={{ flex: 6, paddingBottom: 24 }}>
          <ScrollView>
            <Item
              onPress={this.createNavigationHandler(ROUTE_NAMES.TRANSLATION)}
            >
              🐱
              {"  "}
              Translate
            </Item>
            <Item
              onPress={this.createNavigationHandler(ROUTE_NAMES.WRITING_PAD)}
            >
              📜 Writing Pad
            </Item>
            <Item onPress={this.createNavigationHandler(ROUTE_NAMES.ADD_WORDS)}>
              📋 Add Words
            </Item>
            <Item onPress={this.createNavigationHandler(ROUTE_NAMES.NOTE_PAD)}>
              🗂 Note Pad
            </Item>
            {/* <Item onPress={this.createNavigationHandler(ROUTE_NAMES.RADICALS)}>
              🍰
              {"  "}
              Radicals
            </Item> */}
            <Item onPress={this.createNavigationHandler(ROUTE_NAMES.SETTINGS)}>
              📔
              {"  "}
              Settings
            </Item>
            <Item onPress={this.createNavigationHandler(ROUTE_NAMES.ACCOUNT)}>
              🗃 Account
            </Item>
            <Item onPress={this.createNavigationHandler(ROUTE_NAMES.WELCOME)}>
              🔖{"  "}
              About
            </Item>
            <Item onPress={this.createNavigationHandler(ROUTE_NAMES.CONTACT)}>
              👨‍💻 Feedback
            </Item>
          </ScrollView>
        </View>
        <BottomBlock>
          <SmallItem>
            <Bold>Orange Points: </Bold> {experience.toLocaleString()} 🍊
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
      </ThemedSafeAreaView>
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

const BottomBlock = styled.View({
  flex: 1,
  paddingBottom: 32,
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

const ItemText = styled.Text<any>`
  font-size: 16px;
  margin-top: 45px;
  margin-left: 12px;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.whiteThemeText : COLORS.darkText};
`;

const Bold = styled.Text<any>`
  font-weight: 600;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.whiteThemeText : COLORS.darkText};
`;

const SmallText = styled.Text<any>`
  font-size: 16px;
  margin-top: 4px;
  margin-left: 12px;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.whiteThemeText : COLORS.darkText};
`;

const LinkText = styled.Text<any>`
  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.primaryBlue};
`;

const LineBreak = styled.View<any>`
  width: 90%;
  margin-top: 12px;
  margin-left: 12px;
  margin-bottom: 6px;
  height: 1px;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.dark};
`;

const ThemedSafeAreaView = styled.SafeAreaView<any>`
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(SideMenuComponent);
