import glamorous from "glamorous-native";
import React from "react";
import { Clipboard, FlatList, Keyboard } from "react-native";
import { Searchbar } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { BasicContainer } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Colors";
import {
  GlobalStateContextProps,
  withGlobalState,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingProvider,
} from "@src/providers/SoundRecordingProvider";
import { LessonScreenParams, Word } from "@src/tools/types";
import { filterBySearchTerm, mapWordsForList } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<LessonScreenParams>;
}

interface IState {
  searchValue: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class ViewAllScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      searchValue: "",
    };
  }

  render(): JSX.Element {
    const SearchBar = (
      <Searchbar
        autoFocus
        style={SearchBarStyles}
        placeholder="Filter list (enter Chinese or English)"
        value={this.state.searchValue}
        onChangeText={this.handleSearch}
      />
    );

    return (
      <BasicContainer>
        {SearchBar}
        <FlatList
          onScroll={Keyboard.dismiss}
          contentContainerStyle={{ width: "100%" }}
          data={this.getListContent()}
          renderItem={this.renderItem}
          keyExtractor={(item: Word) => item.traditional}
        />
      </BasicContainer>
    );
  }

  renderItem = ({ item }: { item: Word; index: number }): any => {
    const content = item[this.props.languageSetting];
    return (
      <WordBox onPress={this.copyHandler(content, item.traditional)}>
        <WordText style={{ fontSize: 20 }}>"{item.english}"</WordText>
        <WordText style={{ fontSize: 20 }}>
          {item.pinyin} <SmallText>(pinyin)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 40 }}>
          {item.simplified} <SmallText>(simplified)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 40 }}>
          {item.traditional} <SmallText>(traditional)</SmallText>
        </WordText>
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

  copyHandler = (mandarin: string, traditional: string) => () => {
    try {
      Clipboard.setString(mandarin);
      this.props.handlePronounceWord(traditional);
      this.props.setToastMessage(`${mandarin} copied!`);
    } catch (_) {
      return;
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const WordBox = glamorous.touchableOpacity({
  padding: 8,
  width: "100%",
  paddingLeft: 12,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.wordCardBorder,
  backgroundColor: COLORS.background,
});

const WordText = glamorous.text({
  padding: 4,
  paddingLeft: 8,
});

const SmallText = glamorous.text({
  fontSize: 14,
});

const SearchBarStyles = {
  borderTopWidth: 1,
  borderTopColor: COLORS.lightDark,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(
  withSoundRecordingProvider(ViewAllScreenComponent),
);
