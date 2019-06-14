import glamorous from "glamorous-native";
import React from "react";
import { Keyboard, StyleSheet, Text } from "react-native";
import { Switch, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { Bold, Button, Container } from "@src/components/SharedComponents";
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
  loadingTranslation: boolean;
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
  INPUT_REF: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      input: "",
      loadingTranslation: false,
      sourceLanguageChinese: false,
    };
  }

  componentDidMount(): void {
    this.focusTextInput();
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
          ref={this.setInputRef}
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
        <Button onPress={this.handleTranslate}>
          {this.state.loadingTranslation ? "Translating..." : "Translate"}
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
              copyHandler={() => this.props.copyToClipboard(translation)}
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

  handleTranslate = () => {
    const { loadingTranslation, input, sourceLanguageChinese } = this.state;
    if (loadingTranslation) {
      return;
    }

    if (input !== "") {
      this.setState(
        {
          loadingTranslation: true,
        },
        async () => {
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
                loadingTranslation: false,
                translationResults: wordExistsInDictionary,
              },
              Keyboard.dismiss,
            );
          } else {
            const translationResults = await translateWord(input, sourceCode);
            this.setState(
              { translationResults, loadingTranslation: false },
              Keyboard.dismiss,
            );
          }
        },
      );
    } else {
      this.props.setToastMessage("Please enter a word to translate");
    }
  };

  setInputRef = (ref: any) => {
    // tslint:disable-next-line
    this.INPUT_REF = ref;
  };

  focusTextInput = () => {
    if (this.INPUT_REF) {
      this.INPUT_REF.focus();
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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(TranslationScreenComponent);
