import glamorous from "glamorous-native";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { NavigationScreenProp, SafeAreaView } from "react-navigation";

import { ROUTE_NAMES } from "./RouteNames";

export default (props: { navigation: NavigationScreenProp<{}> }) => (
  <ScrollView
    contentContainerStyle={{ backgroundColor: "rgb(30,30,30)", height: "100%" }}
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
        onPress={() => props.navigation.navigate(ROUTE_NAMES.MANDARIN_QUIZ)}
      >
        🏮
        {"  "}
        English to Mandarin Quiz
      </Item>
      <Item onPress={() => props.navigation.navigate(ROUTE_NAMES.FLASHCARDS)}>
        🎎
        {"  "}
        Mandarin Flashcards
      </Item>
    </SafeAreaView>
  </ScrollView>
);

const Item = glamorous.text({
  fontSize: 16,
  marginTop: 45,
  marginLeft: 12,
  color: "white",
});
