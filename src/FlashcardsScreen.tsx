import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

export default class FlashcardsScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Container>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          🚧 Work in progress 🚧
        </Text>
      </Container>
    );
  }
}

const Container = glamorous.view({
  flex: 1,
  paddingTop: 50,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});
