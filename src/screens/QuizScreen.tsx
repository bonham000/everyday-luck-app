import { Ionicons } from "@expo/vector-icons";
import glamorous from "glamorous-native";
import React from "react";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import ActionButton from "react-native-action-button";
import Confetti from "react-native-confetti";
import { NavigationScreenProp } from "react-navigation";

import GlobalContextProvider, {
  ComponentProp,
  GlobalContextProps,
} from "@src/components/GlobalContextProvider";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/Routes";
import { LessonScreenParams, Word } from "@src/content/types";
import { LessonScoreType } from "@src/GlobalContext";
import { filterForOneCharacterMode, randomInRange } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalContextProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
  lessonType: LessonScoreType;
  Component: ComponentProp;
}

interface IState {
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

  componentDidUpdate(prevProps: IProps): void {
    if (prevProps.selectedLanguage !== this.props.selectedLanguage) {
      this.setState(this.getInitialState());
    }
  }

  render(): JSX.Element {
    const {
      valid,
      didReveal,
      failCount,
      skipCount,
      attempted,
      wordContent,
      shouldShake,
      revealAnswer,
      progressCount,
      oneCharacterMode,
      currentWordIndex,
    } = this.state;
    const CURRENT_WORD = wordContent[currentWordIndex];

    const Component = this.props.Component;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container>
          <Confetti untilStopped duration={1500} ref={this.setConfettiRef} />
          <ProgressText>
            Progress: {progressCount} word
            {progressCount === 1 ? "" : "s"} completed,{" "}
            {wordContent.length - progressCount} remaining, {skipCount} skipped,{" "}
            {failCount} failed
          </ProgressText>
          <Component
            didReveal={didReveal}
            valid={valid}
            revealAnswer={revealAnswer}
            currentWord={CURRENT_WORD}
            shouldShake={shouldShake}
            attempted={attempted}
            setInputRef={this.setInputRef}
            value={this.state.value}
            handleChange={this.handleChange}
            handleCheck={this.handleCheck}
            handleProceed={this.handleProceed}
            selectedLanguage={this.props.selectedLanguage}
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
              onPress={this.handleToggleOneCharacterMode}
              title={`${
                oneCharacterMode ? "Disable" : "Switch to"
              } one-character mode`}
            >
              <Ionicons name="md-jet" style={ActionIconStyle} />
            </ActionButton.Item>
          </ActionButton>
        </Container>
      </TouchableWithoutFeedback>
    );
  }

  getInitialState = (activateOneCharacterMode: boolean = false) => {
    const lesson = this.props.navigation.getParam("lesson");
    return {
      value: "",
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
    const { userScoreStatus, lessonType } = this.props;
    const lessonIndex = this.props.navigation.getParam("lessonIndex");

    const perfectScore = this.state.failCount === 0;
    const firstPass = perfectScore && !userScoreStatus[lessonIndex][lessonType];
    let lessonCompleted = false;
    if (perfectScore) {
      this.props.setLessonScore(lessonIndex, this.props.lessonType);
      const otherLessonType = lessonType === "mc" ? "q" : "mc";
      const otherLessonStatus = userScoreStatus[lessonIndex][otherLessonType];
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
          ? "Great - keep going! 很好!"
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
      (shouldSkipLast && nextWordIndex !== wordContent.length)
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
  position: "absolute",
  left: 5,
  top: 5,
  fontSize: 10,
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

export default ({ QuizComponent, ...rest }: any) => (
  <GlobalContextProvider
    {...rest}
    Component={(childProps: any) => (
      <QuizScreen {...childProps} Component={QuizComponent} />
    )}
  />
);
