import glamorous from "glamorous-native";
import React from "react";
import { Button, Snackbar, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import AppContext, { AppContextShape } from "./AppContext";

interface IProps {
  handleAddNote: AppContextShape["handleAddNote"];
  handleEditNote: AppContextShape["handleEditNote"];
  navigation: NavigationScreenProp<{ title?: string; content?: string }>;
}

interface IState {
  title: string;
  content: string;
  snackMessage: string;
  editingNote: boolean;
  editingNoteDateString: string;
}

class CreateNote extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const title = this.props.navigation.getParam("title", "");
    const content = this.props.navigation.getParam("content", "");
    const editingNoteDateString = this.props.navigation.getParam(
      "dateString",
      "",
    );

    this.state = {
      title,
      content,
      snackMessage: "",
      editingNoteDateString,
      editingNote: !!title && !!content,
    };
  }

  render(): JSX.Element {
    return (
      <Container>
        <Snackbar
          visible={Boolean(this.state.snackMessage)}
          onDismiss={() => this.setState({ snackMessage: "" })}
          action={{
            label: "Okay",
            onPress: () => {
              this.setState({ snackMessage: "" });
            },
          }}
        >
          {this.state.snackMessage}
        </Snackbar>
        <TextInput
          style={{
            width: "95%",
          }}
          mode="outlined"
          label="Note Title"
          value={this.state.title}
          onChangeText={this.handleChangeTitle}
        />
        <TextInput
          style={{
            width: "95%",
            marginTop: 12,
            height: 300,
            maxHeight: 450,
            paddingTop: 18,
          }}
          mode="outlined"
          multiline
          label="Note Content"
          value={this.state.content}
          onChangeText={this.handleChangeContent}
        />
        <Button
          mode="contained"
          style={{ marginTop: 35 }}
          onPress={this.createNote}
        >
          {this.state.editingNote ? "Save Changes" : "Add Note"}
        </Button>
      </Container>
    );
  }

  handleChangeTitle = (title: string) => {
    this.setState({ title });
  };

  handleChangeContent = (content: string) => {
    this.setState({ content });
  };

  createNote = () => {
    const { title, content } = this.state;

    if (!title) {
      this.setState({
        snackMessage: "You must add a title! 🍰",
      });
    } else if (!content) {
      this.setState({
        snackMessage: "Note content is required, too! 🍉",
      });
    } else {
      if (this.state.editingNote) {
        this.props.handleEditNote(
          {
            title: this.state.title,
            content: this.state.content,
            dateCreated: String(new Date()),
          },
          this.state.editingNoteDateString,
        );
      } else {
        this.props.handleAddNote({
          title: this.state.title,
          content: this.state.content,
          dateCreated: String(new Date()),
        });
      }
    }
  };
}

const Container = glamorous.view({
  flex: 1,
  paddingTop: 25,
  alignItems: "center",
  backgroundColor: "#fff",
});

export default (props: any) => {
  return (
    <AppContext.Consumer>
      {(value: AppContextShape) => {
        return (
          <CreateNote
            {...props}
            handleAddNote={value.handleAddNote}
            handleEditNote={value.handleEditNote}
          />
        );
      }}
    </AppContext.Consumer>
  );
};
