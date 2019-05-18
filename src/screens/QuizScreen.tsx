import { Ionicons } from "@expo/vector-icons";
import glamorous from "glamorous-native";
import React from "react";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import ActionButton from "react-native-action-button";
import Confetti from "react-native-confetti";
import { NavigationScreenProp } from "react-navigation";

import GlobalStateProvider, {
  ComponentProp,
  GlobalStateProps,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { LessonScoreType } from "@src/GlobalState";
import { LessonScreenParams, Word } from "@src/tools/types";
import {
  filterForOneCharacterMode,
  getExperiencePointsForLesson,
  randomInRange,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
  quizType: LessonScoreType;
  Component: ComponentProp;
}

interface IState {
  initalizing: boolean;
  value: string;
  attempted: boolean;
  valid: boolean;
  currentWordIndex: number;
  shouldShake: boolean;
  wordCompletedCache: Set<number>;
  progressCount: number;
  revealAnswer: boolean;
  oneCharacterMode: boolean;
  failedOnce: boolean;
  skipCount: number;
  failCount: number;
  didReveal: boolean;
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
    /**
     * Start the quiz when the component mounts at a
     * randomly selected word.
     */
    const currentWordIndex = this.getNextWordIndex();
    this.setState(
      {
        currentWordIndex,
        initalizing: false,
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

  render(): JSX.Element | null {
    const {
      valid,
      didReveal,
      failCount,
      skipCount,
      attempted,
      wordContent,
      initalizing,
      shouldShake,
      revealAnswer,
      progressCount,
      oneCharacterMode,
      currentWordIndex,
    } = this.state;

    if (initalizing) {
      return null;
    }

    const Component = this.props.Component;
    const currentWord = wordContent[currentWordIndex];
    const lesson = this.props.navigation.getParam("lesson");
    const lessonType = this.props.navigation.getParam("type");

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container>
          <Confetti untilStopped duration={1500} ref={this.setConfettiRef} />
          <ProgressText>
            Progress: {progressCount} / {wordContent.length} complete,{" "}
            {skipCount} skipped, {failCount} failed
          </ProgressText>
          <Component
            didReveal={didReveal}
            valid={valid}
            lesson={lesson}
            revealAnswer={revealAnswer}
            currentWord={currentWord}
            shouldShake={shouldShake}
            attempted={attempted}
            setInputRef={this.setInputRef}
            value={this.state.value}
            handleChange={this.handleChange}
            handleCheck={this.handleCheck}
            handleProceed={this.handleProceed}
            languageSetting={this.props.languageSetting}
            handleToggleRevealAnswer={this.handleToggleRevealAnswer}
          />
          <ActionButton position="left" buttonColor={COLORS.actionButtonRed}>
            <ActionButton.Item
              buttonColor={COLORS.actionButtonPurple}
              title="Skip this one!"
              onPress={this.handleProceed(true)}
            >
              <Ionicons name="md-key" style={ActionIconStyle} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor={COLORS.actionButtonMint}
              title="View all definitions"
              onPress={this.navigateToViewAll}
            >
              <Ionicons name="md-school" style={ActionIconStyle} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor={COLORS.actionButtonYellow}
              title="Restart Quiz"
              onPress={this.resetQuiz}
            >
              <Ionicons name="ios-refresh" style={ActionIconStyle} />
            </ActionButton.Item>
            {lessonType === "SUMMARY" && (
              <ActionButton.Item
                buttonColor={COLORS.actionButtonYellow}
                onPress={this.handleToggleOneCharacterMode}
                title={`${
                  oneCharacterMode ? "Disable" : "Switch to"
                } one-character mode`}
              >
                <Ionicons name="md-jet" style={ActionIconStyle} />
              </ActionButton.Item>
            )}
          </ActionButton>
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  getInitialState = (activateOneCharacterMode: boolean = false) => {
    const lesson = this.props.navigation.getParam("lesson");
    return {
      value: "",
      initalizing: true,
      attempted: false,
      valid: false,
      shouldShake: false,
      currentWordIndex: 0,
      failedOnce: false,
      wordCompletedCache: new Set(),
      encouragementText: "",
      progressCount: 0,
      skipCount: 0,
      failCount: 0,
      didReveal: false,
      revealAnswer: false,
      oneCharacterMode: activateOneCharacterMode,
      wordContent: activateOneCharacterMode
        ? filterForOneCharacterMode(lesson)
        : lesson,
    };
  };

  resetQuiz = () => {
    /**
     * TODO: Add confirmation alert.
     */
    this.setState(this.getInitialState());
  };

  handleChange = (value: string) => {
    this.setState({
      value,
      shouldShake: false,
    });
  };

  handleCheck = (correct: boolean) => {
    const { value, wordContent, currentWordIndex } = this.state;

    let failed = false;
    /**
     * Check answer: either correct or incorrect
     */
    if (correct) {
      this.handleCorrectAnswer();
    } else {
      failed = true;
      /**
       * Answer is incorrect:
       *
       * - If this is the first mistake, set the word to be reviewing again later
       * - Also update the button to now reveal the answer
       * - If the user presses again without changing the input, reveal the answer
       * - Otherwise show a different encouragementText each time.
       */
      let updatedContent = wordContent;
      if (!this.state.failedOnce) {
        updatedContent = [...wordContent, wordContent[currentWordIndex]];
      } else {
        if (value === this.state.value) {
          return this.handleToggleRevealAnswer();
        }
      }

      this.setState(prevState => ({
        attempted: true,
        valid: false,
        shouldShake: true,
        failedOnce: true,
        wordContent: updatedContent,
        failCount: failed ? prevState.failCount + 1 : prevState.failCount,
      }));
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
          failedOnce: false,
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

  handleProceed = (didSkip: boolean = false) => () => {
    const didFail = this.state.failedOnce;

    this.setState(
      prevState => ({
        value: "",
        valid: false,
        attempted: false,
        shouldShake: false,
        revealAnswer: false,
        failedOnce: false,
        skipCount: prevState.skipCount + (didSkip ? 1 : 0),
      }),
      () => {
        if (
          this.state.wordCompletedCache.size === this.state.wordContent.length
        ) {
          return this.handleFinish();
        }

        this.setState(
          prevState => {
            const nextIndex = this.getNextWordIndex(didFail);

            return {
              currentWordIndex: nextIndex,
              wordCompletedCache: prevState.wordCompletedCache.add(nextIndex),
            };
          },
          () => {
            this.stopConfetti();
            this.focusInput();
          },
        );
      },
    );
  };

  handleFinish = () => {
    const { userScoreStatus, quizType } = this.props;
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const lessonType = this.props.navigation.getParam("type");

    const exp = getExperiencePointsForLesson(quizType, lessonType);

    const perfectScore = this.state.failCount === 0;
    const firstPass = perfectScore && !userScoreStatus[quizType];
    let lessonCompleted = false;
    if (perfectScore) {
      this.props.setLessonScore(lessonIndex, quizType, exp);
      const otherLessonStatus = userScoreStatus[quizType];
      if (otherLessonStatus) {
        lessonCompleted = true;
      }
    }

    // tslint:disable-next-line
    this.timer = setTimeout(() => {
      Alert.alert(
        lessonCompleted
          ? "The next lesson is unlocked! 🥇"
          : firstPass
          ? "Amazing! You passed this lesson! 💯"
          : "You finished the quiz!",
        lessonCompleted
          ? `Great - keep going! 很好! You earned ${exp} experience points!`
          : firstPass
          ? "Congratulations! 恭喜恭喜！"
          : "All words completed, 好！",
        [
          {
            text: "OK!",
            onPress: () => {
              this.stopConfetti();
              if (lessonCompleted) {
                this.props.navigation.navigate(ROUTE_NAMES.HOME);
              } else {
                this.props.navigation.goBack();
              }
            },
          },
        ],
        { cancelable: false },
      );
    }, 250);
  };

  handleToggleRevealAnswer = () => {
    this.setState(
      prevState => ({
        didReveal: true,
        revealAnswer: !prevState.revealAnswer,
      }),
      () => {
        if (!this.state.revealAnswer) {
          this.focusInput();
        }
      },
    );
  };

  handleToggleOneCharacterMode = () => {
    this.setState(this.getInitialState(!this.state.oneCharacterMode), () => {
      // tslint:disable-next-line
      this.timer = setTimeout(this.stopConfetti, 250);
    });
  };

  navigateToViewAll = () => {
    const type = this.props.navigation.getParam("type");
    const lesson = this.props.navigation.getParam("lesson");
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const params: LessonScreenParams = {
      type,
      lesson,
      lessonIndex,
      headerTitle: `Lesson ${Number(lessonIndex) + 1} Content`,
    };
    this.props.navigation.navigate(ROUTE_NAMES.VIEW_ALL, params);
  };

  getNextWordIndex = (shouldSkipLast: boolean = false): number => {
    const { wordCompletedCache, wordContent } = this.state;
    const nextWordIndex = this.getRandomWordIndex();
    if (
      !wordCompletedCache.has(nextWordIndex) &&
      (shouldSkipLast || nextWordIndex !== wordContent.length)
    ) {
      return nextWordIndex;
    } else {
      return this.getNextWordIndex(shouldSkipLast);
    }
  };

  getRandomWordIndex = (
    min = 0,
    max = this.state.wordContent.length,
  ): number => {
    return randomInRange(min, max);
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

  focusInput = () => {
    if (this.INPUT_REF) {
      this.INPUT_REF.focus();
    }
  };

  setConfettiRef = (node: any) => {
    // tslint:disable-next-line
    this.CONFETTI_REF = node;
  };

  setInputRef = (ref: any) => {
    // tslint:disable-next-line
    this.INPUT_REF = ref;
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
  fontSize: 10,
  justifyContent: "center",
});

const ActionIconStyle = {
  fontSize: 20,
  height: 22,
  color: "white",
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default ({ Component, ...rest }: Partial<IProps>) => (
  <GlobalStateProvider
    {...rest}
    Component={(childProps: any) => (
      <QuizScreen {...childProps} Component={Component} />
    )}
  />
);
