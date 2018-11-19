import glamorous from "glamorous-native";
import React from "react";
import { FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import WORDS, { Word } from "./WordSource";

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

export default class FlashcardsScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Container>
        <FlatList
          contentContainerStyle={{ width: "100%" }}
          data={WORDS.map(w => ({ ...w, key: w.mandarin }))}
          renderItem={({ item, index }: { item: Word; index: number }) => {
            const even = index % 2 === 0;
            return (
              <WordBox
                style={{
                  backgroundColor: even
                    ? "rgb(231,237,240)"
                    : "rgb(226,232,236)",
                }}
              >
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
}

const Container = glamorous.view({
  flex: 1,
  paddingTop: 15,
  paddingBottom: 35,
});

const WordBox = glamorous.view({
  padding: 8,
  width: "100%",
  paddingLeft: 12,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(25,25,25,0.5)",
});

const WordText = glamorous.text({
  padding: 4,
  paddingLeft: 8,
});
