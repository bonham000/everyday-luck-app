import glamorous from "glamorous-native";
import React from "react";
import { Clipboard, FlatList, Keyboard } from "react-native";
import { Searchbar } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { LessonScreenParams, Word } from "@src/api/types";
import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";
import { filterBySearchTerm, mapWordsForList } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<LessonScreenParams>;
}

interface IState {
  searchValue: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class ViewAllScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      searchValue: "",
    };
  }

  render(): JSX.Element {
    const SearchBar = (
      // @ts-ignore
      <Searchbar
        // @ts-ignore
        autoFocus
        style={SearchBarStyles}
        placeholder="Filter list"
        value={this.state.searchValue}
        onChangeText={this.handleSearch}
      />
    );

    return (
      <Container>
        {SearchBar}
        <FlatList
          onScroll={Keyboard.dismiss}
          contentContainerStyle={{ width: "100%" }}
          data={this.getListContent()}
          renderItem={this.renderItem}
        />
      </Container>
    );
  }

  renderItem = ({ item }: { item: Word; index: number }): any => {
    return (
      <WordBox onPress={this.copyHandler(item.traditional)}>
        <WordText style={{ fontSize: 32, padding: 8 }}>
          {item.traditional}
        </WordText>
        <WordText>{item.pinyin}</WordText>
        <WordText>"{item.english}"</WordText>
      </WordBox>
    );
  };

  handleSearch = (searchValue: string) => {
    this.setState({ searchValue });
  };

  getListContent = () => {
    const lesson = this.props.navigation.getParam("lesson");
    const filterWords = filterBySearchTerm(this.state.searchValue);
    return lesson.filter(filterWords).map(mapWordsForList);
  };

  copyHandler = (mandarin: string) => () => {
    try {
      Clipboard.setString(mandarin);
      this.props.setToastMessage(`${mandarin} copied!`);
    } catch (_) {
      return;
    }
  };
}

const Container = glamorous.view({
  flex: 1,
});

const WordBox = glamorous.touchableOpacity({
  padding: 8,
  width: "100%",
  paddingLeft: 12,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.wordCardBorder,
  backgroundColor: COLORS.wordCardBackground,
});

const WordText = glamorous.text({
  padding: 4,
  paddingLeft: 8,
});

const SearchBarStyles = {
  borderTopWidth: 1,
  borderTopColor: COLORS.lightDark,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(ViewAllScreen);
