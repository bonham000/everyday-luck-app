import glamorous from "glamorous-native";
import React from "react";
import { FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";
import WORDS, { Word } from "./WordSource";

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  searchValue: string;
}

export default class FlashcardsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      searchValue: "",
    };
  }
  render(): JSX.Element {
    return (
      <Container>
        <Searchbar
          placeholder="Filter list"
          value={this.state.searchValue}
          onChangeText={this.handleSearch}
        />
        <FlatList
          contentContainerStyle={{ width: "100%" }}
          data={this.getListContent()}
          renderItem={({ item, index }: { item: Word; index: number }) => {
            const even = index % 2 === 0;
            return (
              <WordBox>
                <WordText style={{ fontSize: 32, padding: 8 }}>
                  {item.mandarin}
                </WordText>
                <WordText>{item.pinyin}</WordText>
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
}

const filterBySearchTerm = (searchValue: string) => (word: Word) => {
  const term = searchValue.toLowerCase();
  const { mandarin, pinyin, english } = word;
  return (
    mandarin.toLowerCase().includes(term) ||
    pinyin.toLowerCase().includes(term) ||
    english.toLowerCase().includes(term)
  );
};

const mapWordsForList = (word: Word) => ({
  ...word,
  key: word.mandarin,
});

const Container = glamorous.view({
  flex: 1,
  paddingBottom: 35,
});

const WordBox = glamorous.view({
  padding: 8,
  width: "100%",
  paddingLeft: 12,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(25,25,25,0.5)",
  backgroundColor: "rgb(231, 237, 240)",
});

const WordText = glamorous.text({
  padding: 4,
  paddingLeft: 8,
});
