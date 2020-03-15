import glamorous from "glamorous-native";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  Button,
  ScrollContainer,
} from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  CustomWordStudyList,
  getCustomWordStudyList,
  setCustomWordStudyList,
} from "@src/tools/async-store";
import { translateWord } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  value: string;
  loading: boolean;
  initialized: boolean;
  wordList: CustomWordStudyList;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class AddWordScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: "",
      wordList: [],
      loading: false,
      initialized: false,
    };
  }

  async componentDidMount(): Promise<void> {
    const wordList = await getCustomWordStudyList();
    this.setState({ wordList, initialized: true });
  }

  render(): JSX.Element {
    const { initialized, wordList } = this.state;
    return (
      <ScrollContainer>
        <SectionTitle>Build a Custom Study List</SectionTitle>
        <InfoText>
          Add words for your own study list. You will find these words on the
          Home Screen for you to practice.
        </InfoText>
        <InfoText>
          Enter words in your selected Chinese language setting (
          {this.props.languageSetting}) so the app can understand them!
        </InfoText>
        <TextInput
          mode="outlined"
          label="Add a new word"
          style={TextInputStyles}
          value={this.state.value}
          onChangeText={(value: string) => this.setState({ value })}
        />
        <Button
          onPress={this.handleAddWord}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Add Word
        </Button>
        <LineBreak />
        {initialized ? (
          wordList.length ? (
            <React.Fragment>
              {wordList.map((word, index) => {
                return (
                  <WordContainer key={`${word.traditional}-${index}`}>
                    <RemoveWordButton
                      onPress={() =>
                        this.removeWord(word[this.props.languageSetting], index)
                      }
                    >
                      <Bold style={{ color: COLORS.white }}>Delete</Bold>
                    </RemoveWordButton>
                    <WordView>
                      <WordText>
                        <Bold>{word[this.props.languageSetting]}</Bold> (
                        {word.pinyin}): {word.english}
                      </WordText>
                    </WordView>
                  </WordContainer>
                );
              })}
              <LineBreak style={{ marginTop: 20 }} />
              <Button
                onPress={this.handleClearList}
                style={{
                  marginTop: 15,
                  marginBottom: 15,
                  backgroundColor: COLORS.actionButtonRed,
                }}
              >
                Remove All
              </Button>
            </React.Fragment>
          ) : (
            <InfoText>No words exist yet</InfoText>
          )
        ) : null}
      </ScrollContainer>
    );
  }

  handleAddWord = async () => {
    const { wordList, value, loading } = this.state;

    if (loading || !value) {
      return;
    }

    const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    const hasChinese = value.match(REGEX_CHINESE);
    if (!hasChinese) {
      return this.props.setToastMessage("Is it Chinese?!");
    }

    this.setState(
      {
        loading: true,
      },
      async () => {
        const word = await translateWord(value, this.props.languageSetting);
        const newList: CustomWordStudyList = wordList.concat(word);
        await setCustomWordStudyList(newList);
        this.setState({ value: "", loading: false, wordList: newList }, () => {
          this.props.setToastMessage(
            `${word[this.props.languageSetting]} added!`,
          );
          this.props.reloadLessonSet();
        });
      },
    );
  };

  removeWord = async (word: string, index: number) => {
    const { wordList } = this.state;
    const newList: CustomWordStudyList = [
      ...wordList.slice(0, index),
      ...wordList.slice(index + 1),
    ];
    await setCustomWordStudyList(newList);
    this.setState({ wordList: newList }, () => {
      this.props.setToastMessage(`${word} removed!`);
      this.props.reloadLessonSet();
    });
  };

  handleClearList = () => {
    Alert.alert(
      "Are you sure?",
      "This will clear the word list.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            await setCustomWordStudyList([]);
            this.setState({ wordList: [] }, () => {
              this.props.setToastMessage("List cleared!");
              this.props.reloadLessonSet();
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  handlePressItem = (text: string) => () => {
    this.props.copyToClipboard(text);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const SectionTitle = glamorous.text({
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5,
  marginBottom: 5,
});

const LineBreak = glamorous.view({
  width: "85%",
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const TextInputStyles = {
  width: "90%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

const InfoText = glamorous.text({
  marginTop: 5,
  marginBottom: 5,
  width: "85%",
  textAlign: "center",
});

const WordText = glamorous.text({
  fontSize: 16,
});

const WordView = glamorous.view({
  flex: 6,
  paddingLeft: 8,
});

const WordContainer = glamorous.view({
  marginTop: 8,
  paddingHorizontal: 25,
  flexDirection: "row",
  alignItems: "center",
});

const RemoveWordButton = glamorous.touchableOpacity({
  flex: 1,
  padding: 6,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.actionButtonPink,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(AddWordScreenComponent);
