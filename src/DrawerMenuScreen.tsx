import glamorous from "glamorous-native";
import React from "react";
import { Image, Keyboard, ScrollView, View } from "react-native";
import {
  NavigationActions,
  NavigationScreenProp,
  SafeAreaView,
  StackActions,
} from "react-navigation";

import { ROUTE_NAMES } from "./RouteNames";

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

const resetNavigation = (routeName: ROUTE_NAMES) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
};

export default class extends React.Component<IProps, {}> {
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          backgroundColor: "rgb(28,28,28)",
          height: "100%",
        }}
      >
        <SafeAreaView
          style={{ flex: 1, paddingTop: 75 }}
          forceInset={{ top: "always", horizontal: "never" }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
              source={require("../assets/icon.png")}
            />
          </View>
          <Item
            onPress={() =>
              this.props.navigation.dispatch(
                resetNavigation(ROUTE_NAMES.MANDARIN_QUIZ),
              )
            }
          >
            🏮
            {"  "}
            English to Mandarin Quiz
          </Item>
          <Item
            onPress={() =>
              this.props.navigation.dispatch(
                resetNavigation(ROUTE_NAMES.FLASHCARDS),
              )
            }
          >
            🎎
            {"  "}
            Mandarin Flashcards
          </Item>
        </SafeAreaView>
      </ScrollView>
    );
  }

  getDrawerStateFromProps = (props: IProps) => {
    try {
      // @ts-ignore
      return props.navigation.state.isDrawerOpen;
    } catch (err) {
      return false;
    }
  };
}

const Item = glamorous.text({
  fontSize: 16,
  marginTop: 45,
  marginLeft: 12,
  color: "white",
});
