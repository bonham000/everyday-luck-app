import glamorous from "glamorous-native";
import React from "react";
import { GestureResponderEvent, ViewStyle } from "react-native";
import { Button, Text } from "react-native-paper";

import Shaker from "@src/components/Shaker";
import { COLORS } from "@src/constants/Colors";
import { getLanguageContent } from "@src/content";
import { Lesson, Word } from "@src/content/types";
import { LanguageSelection } from "@src/GlobalContext";
import { getAlternateChoices } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  valid: boolean;
  revealAnswer: boolean;
  didReveal: boolean;
  currentWord: Word;
  shouldShake: boolean;
  attempted: boolean;
  value: string;
  selectedLanguage: LanguageSelection;
  setInputRef: () => void;
  handleChange: () => void;
  handleProceed: () => (event: GestureResponderEvent) => void;
  handleToggleRevealAnswer: (event: GestureResponderEvent) => void;
  handleCheck: (correct: boolean) => (event: GestureResponderEvent) => void;
}

interface IState {
  choices: Lesson;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class MultipleChoiceInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      choices: this.deriveAlternateChoices(),
    };
  }

  deriveAlternateChoices = () => {
    return getAlternateChoices(
      this.props.currentWord,
      getLanguageContent(this.props.selectedLanguage),
    );
  };

  componentDidUpdate(nextProps: IProps): void {
    if (
      nextProps.currentWord.characters !== this.props.currentWord.characters
    ) {
      this.setState({
        choices: this.deriveAlternateChoices(),
      });
    }
  }

  render(): JSX.Element {
    const {
      valid,
      currentWord,
      shouldShake,
      attempted,
      handleProceed,
    } = this.props;
    const shouldReveal = valid || attempted;
    return (
      <React.Fragment>
        <TitleContainer>
          <PinyinText>{currentWord.english}</PinyinText>
        </TitleContainer>
        <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
          <Container>
            {this.state.choices.map(choice => {
              const isCorrect = choice.characters === currentWord.characters;
              return (
                <Choice
                  style={{
                    backgroundColor: valid
                      ? isCorrect
                        ? COLORS.actionButtonMint
                        : COLORS.lightDark
                      : attempted
                      ? isCorrect
                        ? COLORS.actionButtonMint
                        : COLORS.primaryRed
                      : COLORS.lightDark,
                  }}
                  onPress={this.handleSelectAnswer(isCorrect)}
                >
                  <MandarinText
                    style={{
                      color: !valid && attempted ? "white" : "black",
                      fontSize: shouldReveal ? 15 : 45,
                      fontWeight: shouldReveal ? "400" : "bold",
                    }}
                  >
                    {shouldReveal
                      ? `${choice.characters} - ${choice.phonetic} - ${
                          choice.english
                        }`
                      : choice.characters}
                  </MandarinText>
                </Choice>
              );
            })}
          </Container>
        </Shaker>
        {shouldReveal ? (
          <Button
            dark
            mode="contained"
            style={{
              marginTop: 30,
              minWidth: 215,
              backgroundColor: COLORS.primaryBlue,
            }}
            onPress={handleProceed()}
          >
            Proceed
          </Button>
        ) : null}
      </React.Fragment>
    );
  }

  handleSelectAnswer = (isCorrect: boolean) => () => {
    if (!this.props.attempted) {
      this.props.handleCheck(isCorrect);
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TitleContainer = glamorous.view({
  marginTop: 35,
  padding: 15,
  width: "100%",
  alignItems: "center",
});

const Container = glamorous.view({
  width: "100%",
  alignItems: "center",
});

const MandarinText = glamorous.text({
  color: "black",
  marginTop: 15,
  marginBottom: 15,
});

const PinyinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 22,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const Choice = ({
  children,
  style,
  onPress,
}: {
  children: JSX.Element;
  style?: ViewStyle;
  onPress: (event: GestureResponderEvent) => void;
}) => (
  <Button
    dark
    mode="contained"
    style={{
      marginTop: 12,
      width: "90%",
      height: 80,
      justifyContent: "center",
      ...style,
    }}
    onPress={onPress}
  >
    {children}
  </Button>
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default MultipleChoiceInput;
