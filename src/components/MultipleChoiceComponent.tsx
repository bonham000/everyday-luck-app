import glamorous from "glamorous-native";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button, Text } from "react-native-paper";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import Shaker from "@src/components/Shaker";
import { COLORS } from "@src/constants/Colors";
import { Lesson, Word } from "@src/tools/types";
import { getAlternateChoices, MC_TYPE } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  valid: boolean;
  revealAnswer: boolean;
  didReveal: boolean;
  currentWord: Word;
  shouldShake: boolean;
  attempted: boolean;
  value: string;
  multipleChoiceType: MC_TYPE;
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
      this.props.lessons.reduce((flat, curr) => [...flat, ...curr]),
      this.props.multipleChoiceType,
    );
  };

  componentDidUpdate(nextProps: IProps): void {
    if (
      nextProps.currentWord.traditional !== this.props.currentWord.traditional
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
      multipleChoiceType,
    } = this.props;
    const shouldReveal = valid || attempted;
    return (
      <React.Fragment>
        <TitleContainer>
          <QuizPromptText multipleChoiceType={multipleChoiceType}>
            {multipleChoiceType === "MANDARIN"
              ? currentWord.english
              : currentWord.traditional}
          </QuizPromptText>
        </TitleContainer>
        <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
          <Container>
            {this.state.choices.map(choice => {
              const isCorrect = choice.traditional === currentWord.traditional;
              return (
                <Choice
                  valid={valid}
                  attempted={attempted}
                  isCorrect={isCorrect}
                  onPress={this.handleSelectAnswer(isCorrect)}
                >
                  <QuizAnswerText
                    valid={valid}
                    attempted={attempted}
                    shouldReveal={shouldReveal}
                    multipleChoiceType={multipleChoiceType}
                  >
                    {shouldReveal
                      ? `${choice.traditional} - ${choice.pinyin} - ${
                          choice.english
                        }`
                      : multipleChoiceType === "MANDARIN"
                      ? choice.traditional
                      : choice.english}
                  </QuizAnswerText>
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

const QuizAnswerText = ({
  children,
  valid,
  attempted,
  shouldReveal,
  multipleChoiceType,
}: {
  children: string;
  valid: boolean;
  attempted: boolean;
  shouldReveal: boolean;
  multipleChoiceType: MC_TYPE;
}) => (
  <QuizAnswer
    style={{
      color: !valid && attempted ? "white" : "black",
      fontSize: shouldReveal ? 15 : multipleChoiceType === "MANDARIN" ? 45 : 30,
      fontWeight: shouldReveal ? "400" : "bold",
    }}
  >
    {children}
  </QuizAnswer>
);

const QuizAnswer = glamorous.text({
  color: "black",
  marginTop: 15,
  marginBottom: 15,
});

const QuizPromptText = ({
  children,
  multipleChoiceType,
}: {
  children: string;
  multipleChoiceType: MC_TYPE;
}) => (
  <Text
    style={{
      fontWeight: "bold",
      fontSize: multipleChoiceType === "MANDARIN" ? 26 : 52,
    }}
  >
    {children}
  </Text>
);

const Choice = ({
  children,
  valid,
  attempted,
  isCorrect,
  onPress,
}: {
  children: JSX.Element;
  valid: boolean;
  attempted: boolean;
  isCorrect: boolean;
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
    onPress={onPress}
  >
    {children}
  </Button>
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(MultipleChoiceInput);
