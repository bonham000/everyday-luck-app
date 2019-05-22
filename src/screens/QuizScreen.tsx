import { Ionicons } from "@expo/vector-icons";
import glamorous from "glamorous-native";
import React from "react";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import ActionButton from "react-native-action-button";
import Confetti from "react-native-confetti";
import { NavigationScreenProp } from "react-navigation";

import MultipleChoiceComponent from "@src/components/MultipleChoiceComponent";
import QuizInput from "@src/components/QuizInputComponent";
import { Container } from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  QUIZ_TYPE,
  QuizTypeOptions,
  ScoreStatus,
} from "@src/providers/GlobalStateContext";
import {
  GlobalStateContextProps,
  withGlobalState,
} from "@src/providers/GlobalStateProvider";
import { LessonScreenParams, Word } from "@src/tools/types";
import {
  convertAppDifficultyToLessonSize,
  getExperiencePointsForLesson,
  getListScoreKeyFromIndex,
  isLessonComplete,
  mapListIndexToListScores,
  randomInRange,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
  quizType: QUIZ_TYPE;
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
  failedOnce: boolean;
  skipCount: number;
  failCount: number;
  didReveal: boolean;
  quizFinished: boolean;
  quizType: QUIZ_TYPE;
  wordContent: ReadonlyArray<Word>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class QuizScreenComponent extends React.Component<IProps, IState> {
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
      () => {
        // tslint:disable-next-line
        this.timer = setTimeout(this.focusInput, 250);
      },
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
      failCount,
      skipCount,
      initalizing,
      quizFinished,
      wordCompletedCache,
    } = this.state;

    if (initalizing) {
      return null;
    }

    const lesson = this.props.navigation.getParam("lesson");

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container style={{ paddingTop: 8 }}>
          <Confetti untilStopped duration={1500} ref={this.setConfettiRef} />
          {quizFinished ? null : (
            <React.Fragment>
              <ProgressText>
                Question: {wordCompletedCache.size} / {lesson.length} complete,{" "}
                {skipCount} skipped, {failCount} failed
              </ProgressText>
              {this.getQuizComponent()}
              <ActionButton
                zIndex={100}
                position="left"
                buttonColor={COLORS.actionButtonRed}
              >
                <ActionButton.Item
                  buttonColor={COLORS.actionButtonPurple}
                  title="Skip this one!"
                  onPress={this.handleProceed(true)}
                >
                  <Ionicons name="md-key" style={ActionIconStyle} />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor={COLORS.actionButtonYellow}
                  title="Restart Quiz"
                  onPress={this.resetQuiz}
                >
                  <Ionicons name="ios-refresh" style={ActionIconStyle} />
                </ActionButton.Item>
              </ActionButton>
            </React.Fragment>
          )}
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  getQuizComponent = () => {
    const {
      valid,
      quizType,
      didReveal,
      attempted,
      wordContent,
      shouldShake,
      revealAnswer,
      currentWordIndex,
    } = this.state;

    const currentWord = wordContent[currentWordIndex];
    const lesson = this.props.navigation.getParam("lesson");

    const quizProps = {
      valid,
      lesson,
      didReveal,
      revealAnswer,
      currentWord,
      shouldShake,
      attempted,
      value: this.state.value,
      setInputRef: this.setInputRef,
      handleCheck: this.handleCheck,
      handleChange: this.handleChange,
      handleProceed: this.handleProceed,
      languageSetting: this.props.languageSetting,
      handleToggleRevealAnswer: this.handleToggleRevealAnswer,
    };

    return quizType === QUIZ_TYPE.QUIZ_TEXT ? (
      <QuizInput {...quizProps} quizType={quizType} />
    ) : (
      <MultipleChoiceComponent {...quizProps} quizType={quizType} />
    );
  };

  getInitialState = () => {
    const lesson = this.props.navigation.getParam("lesson");
    return {
      value: "",
      skipCount: 0,
      failCount: 0,
      valid: false,
      initalizing: true,
      attempted: false,
      shouldShake: false,
      currentWordIndex: 0,
      failedOnce: false,
      progressCount: 0,
      didReveal: false,
      revealAnswer: false,
      quizFinished: false,
      wordContent: lesson,
      encouragementText: "",
      wordCompletedCache: new Set(),
      quizType: this.getQuizComponentType(),
    };
  };

  resetQuiz = () => {
    this.setState(this.getInitialState(), () => {
      this.props.setToastMessage("Quiz reset!");
      this.setState({ initalizing: false });
    });
  };

  handleChange = (value: string) => {
    this.setState({
      value,
      shouldShake: false,
    });
  };

  getQuizComponentType = (): QUIZ_TYPE => {
    const type = this.props.navigation.getParam("type");
    if (type === "DAILY_QUIZ") {
      const randomIdx = this.getRandomWordIndex(0, 4);
      return QuizTypeOptions[randomIdx];
    } else {
      return this.props.quizType;
    }
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
              quizType: this.getQuizComponentType(),
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
    const listIndex = this.props.navigation.getParam("listIndex");
    const isFinalLesson = this.props.navigation.getParam("isFinalLesson");
    const lessonType = this.props.navigation.getParam("type");

    const lessonContentSize = convertAppDifficultyToLessonSize(
      this.props.appDifficultySetting,
    );

    const experiencePoints = getExperiencePointsForLesson(quizType, lessonType);

    const perfectScore = this.state.failCount === 0;
    const firstPass = perfectScore && !userScoreStatus[quizType];
    let lessonCompleted = false;

    let updatedScoreStatus: ScoreStatus = {
      ...userScoreStatus,
      [quizType]: true,
    };

    const listScoreKey = getListScoreKeyFromIndex(listIndex);
    const listScore = mapListIndexToListScores(listIndex, updatedScoreStatus);

    if (perfectScore) {
      lessonCompleted = isLessonComplete(updatedScoreStatus);

      if (lessonCompleted && lessonType === "LESSON") {
        updatedScoreStatus = {
          ...updatedScoreStatus,
          [listScoreKey]: {
            ...listScore,
            complete: isFinalLesson,
            number_words_completed: (lessonIndex + 1) * lessonContentSize,
          },
        };
      }

      if (lessonCompleted) {
        updatedScoreStatus = {
          ...updatedScoreStatus,
          mc_english: false,
          mc_mandarin: false,
          quiz_text: false,
          mandarin_pronunciation: false,
        };
      }

      this.props.setLessonScore(updatedScoreStatus, experiencePoints);
    }

    // tslint:disable-next-line
    this.timer = setTimeout(() => {
      this.setState(
        {
          quizFinished: true,
        },
        () => {
          Alert.alert(
            lessonCompleted
              ? "The next lesson is unlocked! 🥇"
              : firstPass
              ? "Amazing! You passed this lesson! 💯"
              : "You finished the quiz!",
            lessonCompleted
              ? `Great - keep going! 很好! You earned ${experiencePoints} experience points!`
              : firstPass
              ? `Congratulations! You gained ${experiencePoints} experience points!`
              : "All words completed, 好！",
            [
              {
                text: "OK!",
                onPress: () => {
                  this.stopConfetti();
                  if (lessonCompleted) {
                    if (isFinalLesson) {
                      this.props.navigation.navigate(ROUTE_NAMES.HOME);
                    } else {
                      if (firstPass) {
                        this.props.navigation.navigate(
                          ROUTE_NAMES.LIST_SUMMARY,
                        );
                      } else {
                        this.props.navigation.goBack();
                      }
                    }
                  } else {
                    this.props.navigation.goBack();
                  }
                },
              },
            ],
            { cancelable: false },
          );
        },
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

export default withGlobalState(QuizScreenComponent);
