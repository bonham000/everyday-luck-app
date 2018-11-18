import glamorous from "glamorous-native";
import React from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import AppContext, { AppContextShape } from "./AppContext";

export default (props: any) => (
  <AppContext.Consumer>
    {({ handleResetName, handleClearNotes }: AppContextShape) => {
      return (
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
            <Item onPress={handleResetName}>Change your name ✍</Item>
            <Item
              onPress={() => {
                Alert.alert(
                  "Are you sure?",
                  "All your notes will be gone! 🙀",
                  [
                    { text: "Cancel", onPress: () => null, style: "cancel" },
                    { text: "I’m sure!", onPress: handleClearNotes },
                  ],
                  { cancelable: false },
                );
              }}
            >
              Clear all notes 🙌
            </Item>
          </SafeAreaView>
        </ScrollView>
      );
    }}
  </AppContext.Consumer>
);

const Item = glamorous.text({
  fontSize: 18,
  marginTop: 45,
  marginLeft: 24,
});
