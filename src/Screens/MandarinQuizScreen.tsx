import { Ionicons } from "@expo/vector-icons";
import glamorous from "glamorous-native";
import React from "react";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import ActionButton from "react-native-action-button";
import Confetti from "react-native-confetti";
import { Button, Text, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import Shaker from "@src/Components/Shaker";
import { ROUTE_NAMES } from "@src/Constants/Routes";
import { COMPLIMENTS, ENCOURAGEMENTS } from "@src/Constants/Toasts";
import WORDS, { Word } from "@src/Content/Source";
import { COLORS } from "@src/Styles/Colors";
import { filterForOneCharacterMode, randomInRange } from "@src/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  value: string;
  attempted: boolean;
  valid: boolean;
  currentWordIndex: number;
  shouldShake: boolean;
  wordCompletedCache: Set<number>;
  encouragementText: string;
  progressCount: number;
  revealAnswer: boolean;
  oneCharacterMode: boolean;
  wordContent: ReadonlyArray<Word>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class QuizScreen extends React.Component<IProps, IState> {
  CONFETTI_REF: any = null;
  INPUT_REF: any = null;
  timer: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = this.getInitialState();
  }

  componentDidMount(): void {
    const currentWordIndex = this.getNextWordIndex();
    this.setState(
      {
        currentWordIndex,
        wordCompletedCache: new Set([currentWordIndex]),
      },
      this.focusInput,
    );
  }

  componentWillUnmount(): void {
    this.stopConfetti();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render(): JSX.Element {
    const {
      valid,
      attempted,
      wordContent,
      shouldShake,
      revealAnswer,
      progressCount,
      oneCharacterMode,
      currentWordIndex,
      encouragementText,
    } = this.state;
    const CURRENT_WORD = wordContent[currentWordIndex];

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container>
          <Confetti untilStopped duration={1500} ref={this.setConfettiRef} />
          <ProgressText>
            Progress: {progressCount} word
            {progressCount === 1 ? "" : "s"} completed ({wordContent.length}{" "}
            total)
          </ProgressText>
          {valid || revealAnswer ? (
            <QuizBox>
              <MandarinText>{CURRENT_WORD.mandarin}</MandarinText>
              <PinyinText>{CURRENT_WORD.pinyin}</PinyinText>
            </QuizBox>
          ) : (
            <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
              <QuizBox>
                <EnglishText>"{CURRENT_WORD.english}"</EnglishText>
                <TextInput
                  mode="outlined"
                  error={attempted}
                  ref={this.setInputRef}
                  style={TextInputStyles}
                  value={this.state.value}
                  onChangeText={this.handleChange}
                  onSubmitEditing={this.handleCheck}
                  label="Translate the English to Mandarin please"
                />
              </QuizBox>
            </Shaker>
          )}
          <Button
            dark
            mode="contained"
            style={{
              marginTop: 30,
              minWidth: 215,
              backgroundColor:
                !valid && attempted ? COLORS.primaryRed : COLORS.primaryBlue,
            }}
            onPress={
              valid
                ? this.handleProceed
                : revealAnswer
                  ? this.handleToggleRevealAnswer
                  : this.handleCheck
            }
          >
            {valid
              ? `✨ ${
                  COMPLIMENTS[randomInRange(0, COMPLIMENTS.length - 1)]
                }! Next! ✨`
              : revealAnswer
                ? "Hide Answer 🧐"
                : attempted
                  ? `${encouragementText}! Keep trying! 🙏`
                  : "Check answer 👲"}
          </Button>
          {!valid && (
            <ActionButton position="left" buttonColor={COLORS.actionButtonRed}>
              <ActionButton.Item
                buttonColor={COLORS.actionButtonPurple}
                title="Skip this one!"
                onPress={this.handleProceed}
              >
                <Ionicons name="md-key" style={ActionIconStyle} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={COLORS.actionButtonBlue}
                title={`${revealAnswer ? "Hide" : "Reveal"} answer`}
                onPress={this.handleToggleRevealAnswer}
              >
                <Ionicons name="md-color-wand" style={ActionIconStyle} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={COLORS.actionButtonMint}
                title="View all definitions"
                onPress={() =>
                  this.props.navigation.navigate(ROUTE_NAMES.VIEW_ALL)
                }
              >
                <Ionicons name="md-school" style={ActionIconStyle} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={COLORS.actionButtonYellow}
                onPress={this.handleToggleOneCharacterMode}
                title={`${
                  oneCharacterMode ? "Disable" : "Switch to"
                } one-character mode`}
              >
                <Ionicons name="md-jet" style={ActionIconStyle} />
              </ActionButton.Item>
            </ActionButton>
          )}
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  getInitialState = (activateOneCharacterMode: boolean = false) => {
    return {
      value: "",
      attempted: false,
      valid: false,
      shouldShake: false,
      currentWordIndex: 0,
      wordCompletedCache: new Set(),
      encouragementText: "",
      progressCount: 0,
      revealAnswer: false,
      oneCharacterMode: activateOneCharacterMode,
      wordContent: activateOneCharacterMode
        ? filterForOneCharacterMode(WORDS)
        : WORDS,
    };
  };

  handleChange = (value: string) => {
    this.setState({
      value,
      shouldShake: false,
    });
  };

  handleCheck = () => {
    const CURRENT_WORD = this.state.wordContent[this.state.currentWordIndex];
    /**
     * Check answer: either correct or incorrect
     */
    if (this.state.value === CURRENT_WORD.mandarin) {
      this.handleCorrectAnswer();
    } else {
      this.setState({
        attempted: true,
        valid: false,
        shouldShake: true,
        encouragementText:
          ENCOURAGEMENTS[randomInRange(0, ENCOURAGEMENTS.length - 1)],
      });
    }
  };

  handleCorrectAnswer = () => {
    const { wordCompletedCache } = this.state;
    this.setState(
      prevState => {
        return {
          valid: true,
          attempted: true,
          shouldShake: false,
          progressCount: prevState.progressCount + 1,
        };
      },
      () => {
        this.makeItRain();
        /**
         * Handle finish as well if user is at end.
         */
        if (wordCompletedCache.size === this.state.wordContent.length) {
          this.handleFinish();
        }
      },
    );
  };

  handleProceed = () => {
    this.setState(
      prevState => {
        const nextIndex = this.getNextWordIndex();

        return {
          value: "",
          valid: false,
          attempted: false,
          shouldShake: false,
          revealAnswer: false,
          currentWordIndex: nextIndex,
          wordCompletedCache: prevState.wordCompletedCache.add(nextIndex),
        };
      },
      () => {
        this.stopConfetti();
        this.focusInput();
      },
    );
  };

  handleFinish = () => {
    this.timer = setTimeout(() => {
      Alert.alert(
        "You finished all the words! 🥇",
        "The quiz will now restart.",
        [
          {
            text: "OK!",
            onPress: () => {
              this.setState(this.getInitialState(), () => {
                this.timer = setTimeout(this.stopConfetti, 250);
              });
            },
          },
        ],
        { cancelable: false },
      );
    }, 250);
  };

  handleToggleRevealAnswer = () => {
    this.setState(prevState => ({
      attempted: false,
      revealAnswer: !prevState.revealAnswer,
    }));
  };

  handleToggleOneCharacterMode = () => {
    this.setState(this.getInitialState(!this.state.oneCharacterMode), () => {
      this.timer = setTimeout(this.stopConfetti, 250);
    });
  };

  getNextWordIndex = (): number => {
    const { wordCompletedCache } = this.state;
    const nextWordIndex = this.getRandomWordIndex();
    if (!wordCompletedCache.has(nextWordIndex)) {
      return nextWordIndex;
    } else {
      return this.getNextWordIndex();
    }
  };

  getRandomWordIndex = (): number => {
    return randomInRange(0, this.state.wordContent.length);
  };

  setConfettiRef = (node: any) => {
    // @ts-ignore
    this.CONFETTI_REF = node;
  };

  makeItRain = () => {
    if (this.CONFETTI_REF) {
      this.CONFETTI_REF.startConfetti();
    }
  };

  stopConfetti = () => {
    if (this.CONFETTI_REF) {
      this.CONFETTI_REF.stopConfetti();
    }
  };

  setInputRef = (ref: any) => {
    // @ts-ignore
    this.INPUT_REF = ref;
  };

  focusInput = () => {
    if (this.INPUT_REF) {
      this.INPUT_REF.focus();
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 8,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const ProgressText = glamorous.text({
  position: "absolute",
  left: 5,
  top: 5,
  fontSize: 10,
});

const QuizBox = glamorous.view({
  marginTop: 25,
  height: 125,
  width: "100%",
  alignItems: "center",
});

const TextInputStyles = {
  width: "95%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

const ActionIconStyle = {
  fontSize: 20,
  height: 22,
  color: "white",
};

const EnglishText = ({ children }: { children: string[] }) => (
  <Text
    style={{
      fontSize: 20,
      marginTop: 15,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const MandarinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 40,
      marginTop: 15,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default QuizScreen;
