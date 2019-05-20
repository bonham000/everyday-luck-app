import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { Bold } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Colors";
import { languageCode, TranslationsData } from "@src/tools/types";
import {
  capitalize,
  formatUserLanguageSetting,
  translateWord,
} from "@src/tools/utils";
import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet, Text, ViewStyle } from "react-native";
import { Button, Switch, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
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

class TranslationScreen extends React.Component<IProps, IState> {
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
      const data: ReadonlyArray<[languageCode, string]> = [
        ["english", translationResults.english],
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
            <TranslationTextResult text={translation} language={language} />
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
      const translationResults = await translateWord(input, sourceCode);
      this.setState({ translationResults });
    } else {
      this.props.setToastMessage("Please enter a word to translate");
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 25,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

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

const TranslationTextContainer = glamorous.view({
  marginBottom: 15,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const TranslationTextResult = ({
  text,
  language,
}: {
  text: string;
  language: languageCode;
}) => {
  return (
    <TranslationTextContainer>
      <Text style={{ fontSize: language === "english" ? 28 : 42 }}>{text}</Text>
      <Text style={{ fontSize: 18, marginLeft: 12 }}>
        ({capitalize(language)})
      </Text>
    </TranslationTextContainer>
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

export default withGlobalState(TranslationScreen);
