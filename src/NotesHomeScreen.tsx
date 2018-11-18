import glamorous from "glamorous-native";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import AppContext, { AppContextShape, Note } from "./AppContext";
import { ROUTE_NAMES } from "./RouteNames";

interface IProps {
  notes: ReadonlyArray<Note>;
  navigation: NavigationScreenProp<{}>;
  handleDeleteNote: AppContextShape["handleDeleteNote"];
}

class Home extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Container>
        <View style={{ flex: 8, paddingBottom: 30 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 8 }}>
            {this.props.notes.map(note => {
              return (
                <NoteItem
                  data={note}
                  key={note.dateCreated.toString()}
                  navigation={this.props.navigation}
                  handleDeleteNote={this.props.handleDeleteNote}
                />
              );
            })}
          </ScrollView>
        </View>
        <ControlsContainer>
          <ButtonContainer>
            <Button mode="contained" onPress={this.handleAddNote}>
              Create a Note
            </Button>
          </ButtonContainer>
          <View style={{ flex: 1 }}>{KITTENS[this.getKittenIndex()]}</View>
        </ControlsContainer>
      </Container>
    );
  }

  handleAddNote = () => {
    this.props.navigation.navigate(ROUTE_NAMES.CREATE_NOTE);
  };

  getKittenIndex = () => {
    return Math.floor(Math.random() * 3);
  };
}

interface NoteItemProps {
  data: Note;
  navigation: NavigationScreenProp<{}>;
  handleDeleteNote: AppContextShape["handleDeleteNote"];
}

// tslint:disable-next-line
class NoteItem extends React.Component<
  NoteItemProps,
  { toggleOptions: boolean; abbreviate: boolean }
> {
  CONTENT_LIMIT = 125;

  constructor(props: NoteItemProps) {
    super(props);

    this.state = {
      toggleOptions: false,
      abbreviate: false,
    };
  }

  render(): JSX.Element {
    const { data } = this.props;
    const canAbbreviate = data.content.length > this.CONTENT_LIMIT;
    const noteContent = canAbbreviate
      ? `${data.content.slice(0, 125)}...`
      : data.content;
    return (
      <RowContainer onPress={this.toggleNoteOptions}>
        {this.state.toggleOptions && (
          <OptionsOverlay>
            <Option onPress={this.toggleNoteOptions}>
              <Text>Back 🏇</Text>
            </Option>
            <Option onPress={this.handleViewNote}>
              <Text>View 🔭</Text>
            </Option>
            <Option onPress={this.handleEditNote}>
              <Text>Edit 📑</Text>
            </Option>
            <Option onPress={this.handleDeleteNote}>
              <Text>Delete 🔥</Text>
            </Option>
          </OptionsOverlay>
        )}
        <RowTop>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontWeight: "bold" }}
          >
            {data.title}
          </Text>
          <Text>{new Date(data.dateCreated).toDateString()}</Text>
        </RowTop>
        <View style={{ paddingTop: 8, paddingBottom: 8 }}>
          <Text>{noteContent}</Text>
        </View>
      </RowContainer>
    );
  }

  toggleNoteOptions = () => {
    this.setState({
      toggleOptions: !this.state.toggleOptions,
    });
  };

  handleViewNote = () => {
    const { data } = this.props;
    this.props.navigation.navigate(ROUTE_NAMES.VIEW_NOTE, {
      title: data.title,
      content: data.content,
      dateString: data.dateCreated,
    });
    this.toggleNoteOptions();
  };

  handleEditNote = () => {
    const { data } = this.props;
    this.props.navigation.navigate(ROUTE_NAMES.CREATE_NOTE, {
      title: data.title,
      content: data.content,
      dateString: data.dateCreated,
    });
    this.toggleNoteOptions();
  };

  handleDeleteNote = () => {
    this.props.handleDeleteNote(String(this.props.data.dateCreated));
  };
}

export default (props: any) => {
  return (
    <AppContext.Consumer>
      {(value: AppContextShape) => {
        return (
          <Home
            {...props}
            notes={value.notes}
            handleDeleteNote={value.handleDeleteNote}
          />
        );
      }}
    </AppContext.Consumer>
  );
};

const Container = glamorous.view({
  flex: 1,
  paddingTop: 8,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const ControlsContainer = glamorous.view({
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
});

const ButtonContainer = glamorous.view({
  flex: 2,
  alignItems: "flex-start",
  paddingLeft: 40,
  paddingBottom: 30,
});

const RowContainer = glamorous.touchableOpacity({
  marginTop: 2,
  marginBottom: 2,
  padding: 6,
  width: "100%",
  borderWidth: 1,
  position: "relative",
  borderColor: "rgb(230,230,230)",
  backgroundColor: "rgb(255,255,255)",
});

const OptionsOverlay = glamorous.view({
  zIndex: 10,
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  position: "absolute",
  flexDirection: "row",
  backgroundColor: "#FFFEDD",
});

const Option = glamorous.touchableOpacity({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

const RowTop = glamorous.view({
  paddingTop: 4,
  paddingBottom: 4,
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottomWidth: 1,
  borderBottomColor: "rgb(245,245,245)",
});

const KITTENS = [
  <Image
    style={{ position: "absolute", bottom: -15, right: 10 }}
    // @ts-ignore
    width={165}
    height={165}
    resizeMode="contain"
    source={require("../assets/kittens/kitten-a.png")}
  />,
  <Image
    style={{ position: "absolute", bottom: -15, right: -5 }}
    // @ts-ignore
    width={165}
    height={165}
    resizeMode="contain"
    source={require("../assets/kittens/kitten-b.png")}
  />,
  <Image
    style={{ position: "absolute", bottom: -15, right: 0 }}
    // @ts-ignore
    width={185}
    height={185}
    resizeMode="contain"
    source={require("../assets/kittens/kitten-c.png")}
  />,
  <Image
    style={{ position: "absolute", bottom: -5, right: -5 }}
    // @ts-ignore
    width={155}
    height={155}
    resizeMode="contain"
    source={require("../assets/kittens/kitten-d.png")}
  />,
];
