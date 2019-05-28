import glamorous from "glamorous-native";
import React from "react";
import { Clipboard, Keyboard, StyleSheet, Text, ViewStyle } from "react-native";
import { Button, Switch, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { Bold, Container } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { languageCode, TranslationsData } from "@src/tools/types";
import {
  capitalize,
  formatUserLanguageSetting,
  translateWord,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  input: string;
  translationResults?: TranslationsData;
  sourceLanguageChinese: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class TranslationScreenComponent extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: "",
      sourceLanguageChinese: false,
    };
  }

  render(): JSX.Element {
    const { input, sourceLanguageChinese } = this.state;
    return (
      <Container>
        <SectionTitle>Translation Tool</SectionTitle>
        <InfoText>Translate between English and Chinese</InfoText>
        {!this.props.networkConnected && (
          <WarningText>
            The network is disconnected - translations may not be possible now
          </WarningText>
        )}
        <TextInput
          mode="outlined"
          value={input}
          style={TextInputStyles}
          onChangeText={this.handleChange}
          onSubmitEditing={this.handleTranslate}
          label="Enter text to translate"
        />
        <ToggleLanguageContainer>
          <Switch
            color={COLORS.primaryRed}
            value={sourceLanguageChinese}
            onValueChange={this.handleToggleLanguage}
          />
          <Text style={{ marginLeft: 12 }}>
            Translating from:{" "}
            <Bold>
              {sourceLanguageChinese
                ? formatUserLanguageSetting(this.props.languageSetting)
                : "English"}
            </Bold>
          </Text>
        </ToggleLanguageContainer>
        <Button
          dark
          mode="contained"
          style={ButtonStyles}
          onPress={this.handleTranslate}
        >
          Translate
        </Button>
        {this.renderTranslationResults()}
      </Container>
    );
  }

  renderTranslationResults = () => {
    const { translationResults } = this.state;
    if (translationResults) {
      const data: ReadonlyArray<[keyof TranslationsData, string]> = [
        ["english", translationResults.english],
        ["pinyin", translationResults.pinyin],
        ["simplified", translationResults.simplified],
        ["traditional", translationResults.traditional],
      ];
      return (
        <TranslationResults>
          <LineBreak />
          <SectionTitle style={{ marginTop: 25, marginBottom: 25 }}>
            Translation Results:
          </SectionTitle>
          {data.map(([language, translation]) => (
            <TranslationTextResult
              text={translation}
              language={language}
              copyHandler={this.copyHandler(translation)}
            />
          ))}
        </TranslationResults>
      );
    } else {
      return null;
    }
  };

  handleToggleLanguage = () => {
    this.setState({
      translationResults: undefined,
      sourceLanguageChinese: !this.state.sourceLanguageChinese,
    });
  };

  handleChange = (input: string) => {
    this.setState({ input });
  };

  handleTranslate = async () => {
    const { input, sourceLanguageChinese } = this.state;
    if (input !== "") {
      const sourceCode: languageCode = sourceLanguageChinese
        ? this.props.languageSetting
        : "english";
      const wordExistsInDictionary = this.props.wordDictionary[
        input.toLowerCase()
      ];

      /**
       * Word may already exist in local dictionary!
       */
      if (wordExistsInDictionary) {
        this.setState(
          {
            translationResults: wordExistsInDictionary,
          },
          Keyboard.dismiss,
        );
      } else {
        const translationResults = await translateWord(input, sourceCode);
        this.setState({ translationResults }, Keyboard.dismiss);
      }
    } else {
      this.props.setToastMessage("Please enter a word to translate");
    }
  };

  copyHandler = (text: string) => () => {
    try {
      Clipboard.setString(text);
      this.props.setToastMessage(`${text} copied!`);
    } catch (_) {
      return;
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */
const ToggleLanguageContainer = glamorous.view({
  height: 75,
  flexDirection: "row",
  alignItems: "center",
});

const TranslationResults = glamorous.view({
  padding: 12,
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
});

const SectionTitle = glamorous.text({
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5,
  marginBottom: 5,
});

const InfoText = glamorous.text({
  marginTop: 5,
  marginBottom: 5,
  width: "80%",
  textAlign: "center",
});

const WarningText = glamorous.text({
  fontSize: 14,
  marginTop: 5,
  marginBottom: 5,
  width: "80%",
  textAlign: "center",
});

const TranslationTextContainer = glamorous.touchableOpacity({
  marginBottom: 15,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const TranslationTextResult = ({
  text,
  language,
  copyHandler,
}: {
  text: string;
  language: keyof TranslationsData;
  copyHandler: () => void;
}) => {
  const romanized = language === "english" || language === "pinyin";
  return Boolean(text) ? (
    <TranslationTextContainer onPress={copyHandler}>
      <Text style={{ fontSize: romanized ? 28 : 42 }}>{text}</Text>
      <Text style={{ fontSize: 18, marginLeft: 12 }}>
        ({capitalize(language)})
      </Text>
    </TranslationTextContainer>
  ) : (
    <Text style={{ fontSize: 18, marginLeft: 12 }}>
      ({capitalize(language)}): No results...
    </Text>
  );
};

const LineBreak = glamorous.view({
  width: "95%",
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const TextInputStyles = {
  width: "90%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

const ButtonStyles: ViewStyle = {
  marginTop: 15,
  marginBottom: 15,
  width: "65%",
  height: 40,
  justifyContent: "center",
  alignItems: "center",
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(TranslationScreenComponent);
