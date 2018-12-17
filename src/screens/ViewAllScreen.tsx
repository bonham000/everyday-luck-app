import glamorous from "glamorous-native";
import React from "react";
import { Clipboard, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import ToastProvider from "@src/components/ToastProvider";
import WORDS, { Word } from "@src/content/Mandarin";
import { COLORS } from "@src/styles/Colors";
import { filterBySearchTerm, mapWordsForList } from "@src/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
  setToastMessage: (toastMessage: string) => void;
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
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ width: "100%" }}
          data={this.getListContent()}
          renderItem={({ item }: { item: Word; index: number }) => {
            return (
              <WordBox onPress={this.copyHandler(item.characters)}>
                <WordText style={{ fontSize: 32, padding: 8 }}>
                  {item.characters}
                </WordText>
                <WordText>{item.phonetic}</WordText>
                <WordText>"{item.english}"</WordText>
              </WordBox>
            );
          }}
        />
      </Container>
    );
  }

  handleSearch = (searchValue: string) => {
    this.setState({
      searchValue,
    });
  };

  getListContent = () => {
    const filterWords = filterBySearchTerm(this.state.searchValue);
    return WORDS.filter(filterWords).map(mapWordsForList);
  };

  copyHandler = (mandarin: string) => () => {
    try {
      Clipboard.setString(mandarin);
      this.props.setToastMessage(`${mandarin} copied!`);
    } catch (_) {
      return; // no-op
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

export default (props: any) => (
  <ToastProvider {...props} Component={ViewAllScreen} />
);
