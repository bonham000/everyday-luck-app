import glamorous from "glamorous-native";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-navigation";

export default (props: any) => (
  <ScrollView>
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
      <Item>Prompts</Item>
      <Item>Flashcards</Item>
    </SafeAreaView>
  </ScrollView>
);

const Item = glamorous.text({
  fontSize: 18,
  marginTop: 45,
  marginLeft: 24,
});
