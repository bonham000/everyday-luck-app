import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "./RouteNames";

interface IProps {
  navigation: NavigationScreenProp<{ title?: string; content?: string }>;
}

interface IState {
  title: string;
  content: string;
  dateString: string;
}

class ViewNote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const title = this.props.navigation.getParam("title", "");
    const content = this.props.navigation.getParam("content", "");
    const dateString = this.props.navigation.getParam("dateString", "");

    this.state = {
      title,
      content,
      dateString,
    };
  }

  render(): JSX.Element {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 8 }}>
          <ScrollView
            contentContainerStyle={{
              paddingTop: 25,
              paddingBottom: 35,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>{this.state.content}</Text>
          </ScrollView>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF",
            paddingBottom: 15,
          }}
        >
          <Button
            mode="contained"
            style={{ width: 300 }}
            onPress={this.handleEditNote}
          >
            Edit Note
          </Button>
        </View>
      </View>
    );
  }

  handleEditNote = () => {
    const { title, content, dateString } = this.state;
    this.props.navigation.navigate(ROUTE_NAMES.CREATE_NOTE, {
      title,
      content,
      dateString,
    });
  };
}

export default ViewNote;
