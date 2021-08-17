import styled from "@emotion/native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import ActionButton from "react-native-action-button";
import Confetti from "react-native-confetti";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import MultipleChoiceComponent from "@src/components/MultipleChoiceComponent";
import QuizInput from "@src/components/QuizInputComponent";
import { ScrollContainer } from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import { ListScoreSet } from "@src/lessons";
import { QUIZ_TYPE } from "@src/providers/GlobalStateContext";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingContext,
} from "@src/providers/SoundRecordingProvider";
import {
  LessonScreenParams,
  LessonSummaryType,
  QuizCacheSet,
  QuizScreenComponentProps,
  Word,
} from "@src/tools/types";
import {
  calculateExperiencePointsForLesson,
  convertAppDifficultyToLessonSize,
  getQuizSuccessToasts,
  hasUserCompletedAllLists,
  isLessonComplete,
  knuthShuffle,
  mapListIndexToListScores,
  randomInRange,
} from "@src/tools/utils";
import MOCKS from "@tests/mocks";
import {
  CustomWordStudyList,
  getBookmarkWordList,
  getFailedWordList,
  setBookmarkWordList,
  setFailedWordList,
} from "@src/tools/async-store";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
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
  failCount: number;
  didReveal: boolean;
  quizFinished: boolean;
  quizType: QUIZ_TYPE;
  failedWords: Set<string>;
  wordContent: ReadonlyArray<Word>;
  failedWordList: CustomWordStudyList;
  bookmarkedWordList: CustomWordStudyList;
}

/**
 * The cost of reverting a failed answer! 🍊
 */
const REVERSION_PENALTY = 25;

/**
 * The delay time for proceeding to the next question if the
 * autoProceedQuestion setting is enabled.
 */

const AUTO_PROCEED_DELAY = 900;

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

  getInitialState = (): IState => {
    const { navigation } = this.props;
    const lesson = navigation.getParam("lesson");
    return {
      value: "",
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
      failedWords: new Set(),
      failedWordList: [],
      bookmarkedWordList: [],
      wordCompletedCache: new Set(),
      wordContent: knuthShuffle(lesson),
      quizType: this.getQuizComponentType(),
    };
  };

  async componentDidMount(): Promise<void> {
    /**
     * Start the quiz when the component mounts at a
     * randomly selected word.
     */
    const currentWordIndex = this.getNextWordIndex();
    const bookmarkedWordList = await getBookmarkWordList();
    const currentWord = this.state.wordContent[currentWordIndex];
    const failedWordList = await getFailedWordList();
    this.setState(
      {
        failedWordList,
        bookmarkedWordList,
        currentWordIndex,
        initalizing: false,
        wordCompletedCache: new Set([currentWordIndex]),
      },
      () => {
        this.handleAutoPronounceWord(currentWord.traditional);
        // tslint:disable-next-line
        this.timer = setTimeout(this.focusTextInput, 250);
      },
    );
  }

  componentWillUnmount(): void {
    this.stopConfettiAnimation();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render(): JSX.Element | null {
    if (this.state.initalizing) {
      return null;
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <React.Fragment>
          <ScrollContainer style={{ paddingTop: 8 }}>
            <Confetti untilStopped duration={1500} ref={this.setConfettiRef} />
            {!this.state.quizFinished && (
              <React.Fragment>
                {this.renderProgressText()}
                {this.getQuizComponent()}
              </React.Fragment>
            )}
          </ScrollContainer>
          {this.renderActionButtons()}
        </React.Fragment>
      </TouchableWithoutFeedback>
    );
  }

  renderProgressText = () => {
    const { failCount, progressCount } = this.state;
    const lesson = this.props.navigation.getParam("lesson");
    const total = lesson.length;
    const completedNumber = progressCount;

    return (
      <ProgressText>
        Question: {completedNumber + 1} / {total}, {failCount} failed
      </ProgressText>
    );
  };

  getQuizComponentType = (): QUIZ_TYPE => {
    const type = this.props.navigation.getParam("type");
    const shuffleQuizType = this.props.navigation.getParam("shuffleQuizType");
    const IS_RANDOM_QUIZ =
      type === "SHUFFLE_QUIZ" ||
      type === "DAILY_QUIZ" ||
      type === "OPT_OUT_CHALLENGE";

    if (IS_RANDOM_QUIZ) {
      const multipleChoiceShuffleQuiz = [
        QUIZ_TYPE.ENGLISH,
        QUIZ_TYPE.MANDARIN,
        QUIZ_TYPE.PRONUNCIATION,
      ];

      const charactersShuffleQuiz = [
        QUIZ_TYPE.QUIZ_TEXT,
        QUIZ_TYPE.QUIZ_TEXT_REVERSE,
      ];

      const optOutChallengeQuiz = [
        QUIZ_TYPE.ENGLISH,
        QUIZ_TYPE.MANDARIN,
        QUIZ_TYPE.PRONUNCIATION,
      ];

      let options;

      if (type === "DAILY_QUIZ" || type === "OPT_OUT_CHALLENGE") {
        if (shuffleQuizType === "characters") {
          options = charactersShuffleQuiz;
        } else {
          options = optOutChallengeQuiz;
        }
      } else if (shuffleQuizType === "multiple-choice") {
        options = multipleChoiceShuffleQuiz;
      } else if (shuffleQuizType === "characters") {
        options = charactersShuffleQuiz;
      }

      // Remove pronunciation option if applicable and if it is disabled
      if (shuffleQuizType !== "characters" && this.props.disableAudio) {
        if (options !== undefined) {
          options.pop();
        }
      }

      if (!options || options.length === 0) {
        return this.getQuizComponentType();
      }

      const randomIdx = this.getRandomWordIndex(
        0,
        !!options ? options.length : 0,
      );
      const quizType = options[randomIdx];

      if (this.state === undefined || quizType !== this.state.quizType) {
        return quizType;
      } else {
        return this.getQuizComponentType();
      }
    } else {
      return this.props.quizType;
    }
  };

  getQuizComponent = () => {
    const {
      value,
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

    const quizProps: QuizScreenComponentProps = {
      value,
      valid,
      lesson,
      quizType,
      didReveal,
      attempted,
      currentWord,
      shouldShake,
      revealAnswer,
      theme: this.props.appTheme,
      setInputRef: this.setInputRef,
      handleChange: this.handleChange,
      handleCheck: this.handleCheckAnswer,
      audioDisabled: this.props.disableAudio,
      wordDictionary: this.props.wordDictionary,
      languageSetting: this.props.languageSetting,
      handleProceed: this.handleProceedToNextQuestion,
      handleCopyToClipboard: this.props.copyToClipboard,
      autoProceedQuestion: this.props.autoProceedQuestion,
      handleToggleRevealAnswer: this.handleToggleRevealAnswer,
    };

    if (quizType === QUIZ_TYPE.QUIZ_TEXT_REVERSE) {
      return <QuizInput {...quizProps} />;
    }

    if (quizType === QUIZ_TYPE.QUIZ_TEXT) {
      return <QuizInput {...quizProps} />;
    }

    return (
      <MultipleChoiceComponent
        {...this.props}
        {...quizProps}
        lessons={this.props.lessons}
        handlePronounceWord={this.props.handlePronounceWord}
      />
    );
  };

  renderActionButtons = () => {
    const {
      wordContent,
      failedWordList,
      currentWordIndex,
      bookmarkedWordList,
    } = this.state;

    const currentWord = wordContent[currentWordIndex];

    const isCurrentWordBookmarked = bookmarkedWordList.find(x => {
      return x.traditional === currentWord.traditional;
    });

    const isCurrentWordInFailedWordList = failedWordList.find(x => {
      return x.traditional === currentWord.traditional;
    });

    return (
      <ActionButton
        zIndex={40}
        position="left"
        buttonColor={COLORS.actionButtonPink}
      >
        {isCurrentWordInFailedWordList && (
          <ActionButton.Item
            style={{ zIndex: 50 }}
            title="Remove Failed List Word"
            buttonColor={COLORS.actionButtonPink}
            onPress={() => this.handleRemoveFailedWordFromList(currentWord)}
          >
            <Ionicons name="trash" style={ActionIconStyle} />
          </ActionButton.Item>
        )}
        {isCurrentWordBookmarked ? (
          <ActionButton.Item
            style={{ zIndex: 50 }}
            title="Remove Bookmarked Word"
            buttonColor={COLORS.actionButtonRed}
            onPress={() => this.handleRemoveBookmarkWord(currentWord)}
          >
            <Ionicons name="trash-bin" style={ActionIconStyle} />
          </ActionButton.Item>
        ) : (
          <ActionButton.Item
            style={{ zIndex: 50 }}
            title="Bookmark Word"
            buttonColor={COLORS.actionButtonYellow}
            onPress={() => this.handleBookmarkWord(currentWord)}
          >
            <Ionicons name="bookmark" style={ActionIconStyle} />
          </ActionButton.Item>
        )}
        {this.state.failedOnce && (
          <ActionButton.Item
            style={{ zIndex: 50 }}
            title="Use an Orange! 🍊"
            onPress={this.handleRevertAnswer}
            buttonColor={COLORS.actionButtonBlue}
          >
            <Ionicons name="ios-star" style={ActionIconStyle} />
          </ActionButton.Item>
        )}
        <ActionButton.Item
          style={{ zIndex: 50 }}
          onPress={this.toggleAutoProceed}
          buttonColor={COLORS.actionButtonMint}
          title={`${
            this.props.autoProceedQuestion ? "Disable" : "Enable"
          } auto next question`}
        >
          <Ionicons name="ios-rocket" style={ActionIconStyle} />
        </ActionButton.Item>
        <ActionButton.Item
          style={{ zIndex: 50 }}
          onPress={this.toggleDisableAudio}
          buttonColor={COLORS.actionButtonPurple}
          title={`${
            this.props.disableAudio ? "Enable" : "Disable"
          } audio pronunciation`}
        >
          <Ionicons
            name={
              this.props.disableAudio ? "ios-volume-off" : "ios-volume-high"
            }
            style={ActionIconStyle}
          />
        </ActionButton.Item>
        <ActionButton.Item
          style={{ zIndex: 50 }}
          title="Shuffle and restart quiz"
          onPress={this.resetQuiz}
          buttonColor={COLORS.actionButtonOrange}
        >
          <Ionicons name="ios-refresh" style={ActionIconStyle} />
        </ActionButton.Item>
      </ActionButton>
    );
  };

  toggleDisableAudio = () => {
    this.props.handleUpdateUserSettingsField({
      disable_audio: !this.props.disableAudio,
    });
  };

  handleBookmarkWord = async (word: Word) => {
    const { bookmarkedWordList } = this.state;
    const newList = bookmarkedWordList.concat(word);
    await setBookmarkWordList(newList);
    await this.props.reloadLessonSet();
    this.props.setToastMessage(`${word.traditional} bookmarked!`);
  };

  handleRemoveBookmarkWord = async (word: Word) => {
    const { bookmarkedWordList } = this.state;
    const newList = bookmarkedWordList.filter(
      x => x.traditional !== word.traditional,
    );
    await setBookmarkWordList(newList);
    await this.props.reloadLessonSet();
    this.props.setToastMessage(`${word.traditional} word removed!`);
  };

  handleRemoveFailedWordFromList = async (word: Word) => {
    const { failedWordList } = this.state;
    const newList = failedWordList.filter(
      x => x.traditional !== word.traditional,
    );
    await setFailedWordList(newList);
    await this.props.reloadLessonSet();
    this.props.setToastMessage(
      `${word.traditional} word removed from failed word list!`,
    );
  };

  toggleAutoProceed = () => {
    const currentValue = this.props.autoProceedQuestion;
    this.props.handleUpdateUserSettingsField(
      {
        auto_proceed_question: !currentValue,
      },
      () => {
        if (!currentValue) {
          this.props.setToastMessage(
            "Questions will automatically advance when answered correctly.",
          );
        }

        /**
         * If the current question is already answered proceed to the next
         * question.
         */
        if (this.state.valid) {
          // tslint:disable-next-line
          this.timer = setTimeout(
            this.handleProceedToNextQuestion,
            AUTO_PROCEED_DELAY,
          );
        }
      },
    );
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

  handleRevertAnswer = () => {
    if (!this.state.failedOnce) {
      return;
    }

    const { experience } = this.props;
    const cost = REVERSION_PENALTY;
    /**
     * If the current question is failed decrement the fail count
     * and proceed to the next question. The user will have another
     * chance to answer this word correctly.
     */
    if (cost <= experience) {
      Alert.alert(
        "Are you sure?",
        `This will cost you ${cost} 🍊 (you have a total of ${experience} oranges now!).`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => null,
          },
          { text: "OK", onPress: () => this.handleRevertFailedAnswer(cost) },
        ],
        { cancelable: false },
      );
    } else {
      this.props.setToastMessage("You don't have enough 🍊 to do that! Sorry!");
    }
  };

  handleRevertFailedAnswer = (cost: number) => {
    this.setState(
      prevState => ({
        failCount: prevState.failCount - 1,
      }),
      () => {
        this.props.updateExperiencePoints(-cost);
        this.props.setToastMessage("That's 天天吉! 🍊 Keep going!");
        this.handleProceedToNextQuestion();
      },
    );
  };

  handleCheckAnswer = async (correct: boolean) => {
    const { value, wordContent, failedWords, currentWordIndex } = this.state;

    const currentWord = wordContent[currentWordIndex];
    const { traditional } = currentWord;
    const { quizCacheSet, handleUpdateUserSettingsField } = this.props;
    const quizCacheSetCopy: QuizCacheSet = JSON.parse(
      JSON.stringify(quizCacheSet),
    );

    // Only make the QuizCacheSet updates for the Daily Review Quiz
    const type = this.props.navigation.getParam("type");
    const IS_DAILY_REVIEW_QUIZ = type === "DAILY_QUIZ";

    let failed = false;
    /**
     * Check answer: either correct or incorrect
     */
    if (correct) {
      if (IS_DAILY_REVIEW_QUIZ) {
        // Only update if it was not a failed word
        if (!failedWords.has(traditional)) {
          const status = quizCacheSetCopy[traditional];
          if (status === "selected") {
            // Do nothing
          } else if (status === "failed-primary") {
            // Set to failed secondary so it can be selected again later
            quizCacheSetCopy[traditional] = "failed-secondary";
          } else if (status === "failed-secondary") {
            quizCacheSetCopy[traditional] = "selected";
          } else {
            quizCacheSetCopy[traditional] = "selected";
          }

          handleUpdateUserSettingsField({ quizCacheSet: quizCacheSetCopy });
        }
      }

      this.handleCorrectAnswer();
    } else {
      failed = true;
      if (IS_DAILY_REVIEW_QUIZ) {
        const status = quizCacheSetCopy[traditional];
        // The word has been failed again, add it to the failed word list
        if (status === "failed-primary" || status === "failed-secondary") {
          const failedWordList = await getFailedWordList();
          // Only add the word if it doesn't exist in the failed words list yet
          if (
            !failedWordList.find(x => x.traditional === currentWord.traditional)
          ) {
            const updatedList = failedWordList.concat(currentWord);
            await setFailedWordList(updatedList);
            await this.props.reloadLessonSet();
          }
        }

        // Remove the word from the quiz cache set so it can be visited again:
        quizCacheSetCopy[traditional] = "failed-primary";
        handleUpdateUserSettingsField({ quizCacheSet: quizCacheSetCopy });
      }

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

      this.setState(prevState => {
        const failedWordsCopy = new Set(Array.from(prevState.failedWords));
        failedWordsCopy.add(traditional);

        return {
          attempted: true,
          valid: false,
          shouldShake: true,
          failedOnce: true,
          wordContent: updatedContent,
          failedWords: failedWordsCopy,
          failCount: failed ? prevState.failCount + 1 : prevState.failCount,
        };
      });
    }
  };

  handleCorrectAnswer = () => {
    const { wordCompletedCache } = this.state;
    this.setState(
      {
        valid: true,
        attempted: true,
        shouldShake: false,
      },
      () => {
        this.startConfettiAnimation();
        /**
         * Handle finish as well if user is at end.
         */
        if (wordCompletedCache.size === this.state.wordContent.length) {
          this.handleCompleteQuiz();
        } else if (this.props.autoProceedQuestion) {
          // tslint:disable-next-line
          this.timer = setTimeout(
            this.handleProceedToNextQuestion,
            AUTO_PROCEED_DELAY,
          );
        }
      },
    );
  };

  handleProceedToNextQuestion = () => {
    this.setState(
      prevState => ({
        value: "",
        valid: false,
        attempted: false,
        shouldShake: false,
        revealAnswer: false,
        failedOnce: false,
        progressCount: prevState.progressCount + (prevState.failedOnce ? 0 : 1),
      }),
      () => {
        if (
          this.state.wordCompletedCache.size === this.state.wordContent.length
        ) {
          return this.handleCompleteQuiz();
        }

        const nextIndex = this.getNextWordIndex();
        const word = this.state.wordContent[nextIndex];

        this.setState(
          prevState => {
            return {
              currentWordIndex: nextIndex,
              quizType: this.getQuizComponentType(),
              wordCompletedCache: prevState.wordCompletedCache.add(nextIndex),
            };
          },
          () => {
            this.stopConfettiAnimation();
            this.focusTextInput();
            this.handleAutoPronounceWord(word.traditional);
          },
        );
      },
    );
  };

  /**
   * If audio and autoProceed are enabled, automatically pronounce
   * the word after a short delay when loading the next question.
   */
  handleAutoPronounceWord = (word: string) => {
    if (!this.props.disableAudio && this.props.autoProceedQuestion) {
      // tslint:disable-next-line
      this.timer = setTimeout(() => this.props.handlePronounceWord(word), 250);
    }
  };

  handleCompleteQuiz = () => {
    const { userScoreStatus, quizType } = this.props;
    const lessonType = this.props.navigation.getParam("type");
    const listId = this.props.navigation.getParam("id");
    const isFinalLesson = this.props.navigation.getParam("isFinalLesson");
    const shuffleQuizType = this.props.navigation.getParam("shuffleQuizType");

    const listScore = userScoreStatus[listId];

    /* Is the quiz finished with a perfect score */
    const perfectScore = this.state.failCount === 0;
    /* Is this the first time the user completed this quiz */
    const firstPass = perfectScore && !!quizType && !listScore[quizType];
    /* Determine experience points for this lesson */
    const experiencePoints = calculateExperiencePointsForLesson(
      firstPass,
      perfectScore,
      quizType,
      lessonType,
      shuffleQuizType,
    );

    let lessonCompleted = false;
    const updatedScoreStatus: ListScoreSet = {
      ...userScoreStatus,
    };

    const allComplete = hasUserCompletedAllLists(updatedScoreStatus);

    /* Is the lesson fully completed, use updated list score with current lesson */
    lessonCompleted = isLessonComplete({
      ...listScore,
      [quizType]: perfectScore,
    });

    if (perfectScore) {
      this.handleSettingScoresForLesson(
        updatedScoreStatus,
        lessonCompleted,
        experiencePoints,
        quizType,
      );
    }

    // tslint:disable-next-line
    this.timer = setTimeout(() => {
      this.setState(
        {
          quizFinished: true,
        },
        () =>
          this.handleSuccessAlert(
            lessonCompleted,
            firstPass,
            lessonType,
            experiencePoints,
            isFinalLesson,
            perfectScore,
            allComplete,
          ),
      );
    }, 350);
  };

  handleSettingScoresForLesson = (
    updatedScores: ListScoreSet,
    lessonCompleted: boolean,
    experiencePoints: number,
    quizType: QUIZ_TYPE,
  ) => {
    let updatedScoreStatus = updatedScores;
    const { lessons } = this.props;
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const listIndex = this.props.navigation.getParam("listIndex");
    const isFinalLesson = this.props.navigation.getParam("isFinalLesson");
    const lessonType = this.props.navigation.getParam("type");
    const listId = this.props.navigation.getParam("id");
    const listScoreKey = listId;

    const lessonContentSize = convertAppDifficultyToLessonSize(
      this.props.appDifficultySetting,
    );

    const listScore = mapListIndexToListScores(listId, updatedScoreStatus);

    /**
     * Mark this quiz type as complete on the user score history.
     */
    updatedScoreStatus = {
      ...updatedScoreStatus,
      [listScoreKey]: {
        ...listScore,
        [quizType]: true,
      },
    };

    /**
     * A lesson is complete.
     */
    if (lessonCompleted && lessonType === "LESSON") {
      updatedScoreStatus = {
        ...updatedScoreStatus,
        [listScoreKey]: {
          ...listScore,
          ...MOCKS.DEFAULT_LESSON_SCORES,
          complete: isFinalLesson,
          number_words_completed: (lessonIndex + 1) * lessonContentSize,
        },
      };
    }

    /**
     * User completed one of the HSK opt-out challenges. Update their scores
     * to complete the entire HSK Level.
     */
    if (lessonType === "OPT_OUT_CHALLENGE") {
      updatedScoreStatus = {
        ...updatedScoreStatus,
        [listScoreKey]: {
          ...listScore,
          ...MOCKS.DEFAULT_LESSON_SCORES,
          complete: true,
          number_words_completed: lessons[listIndex].content.length,
        },
      };
    }

    this.props.setLessonScore(updatedScoreStatus, experiencePoints);
  };

  handleSuccessAlert = (
    lessonCompleted: boolean,
    firstPass: boolean,
    lessonType: LessonSummaryType,
    experience: number,
    isFinalLesson: boolean,
    perfectScore: boolean,
    allComplete: boolean,
  ) => {
    const { primary, secondary } = getQuizSuccessToasts(
      lessonCompleted,
      firstPass,
      lessonType,
      experience,
      perfectScore,
      allComplete,
    );
    Alert.alert(
      primary,
      secondary,
      [
        {
          text: "OK!",
          onPress: () => {
            this.handleSuccessConfirmation(
              lessonCompleted,
              isFinalLesson,
              firstPass,
              lessonType,
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  handleSuccessConfirmation = (
    lessonCompleted: boolean,
    isFinalLesson: boolean,
    firstPass: boolean,
    lessonType: LessonSummaryType,
  ) => {
    this.stopConfettiAnimation();
    if (lessonType === "SHUFFLE_QUIZ") {
      this.props.navigation.goBack();
    } else if (
      lessonType === "DAILY_QUIZ" ||
      lessonType === "OPT_OUT_CHALLENGE"
    ) {
      this.props.navigation.navigate(ROUTE_NAMES.HOME);
    } else if (lessonCompleted) {
      if (isFinalLesson) {
        this.props.navigation.navigate(ROUTE_NAMES.HOME);
      } else {
        if (firstPass) {
          this.props.navigation.navigate(ROUTE_NAMES.LIST_SUMMARY);
        } else {
          this.props.navigation.goBack();
        }
      }
    } else {
      this.props.navigation.goBack();
    }
  };

  handleToggleRevealAnswer = () => {
    this.setState(
      prevState => ({
        didReveal: true,
        revealAnswer: !prevState.revealAnswer,
      }),
      () => {
        if (!this.state.revealAnswer) {
          this.focusTextInput();
        }
      },
    );
  };

  getNextWordIndex = (): number => {
    const { wordCompletedCache, currentWordIndex, wordContent } = this.state;
    const nextWordIndex = this.getRandomWordIndex();
    const currentWord = wordContent[currentWordIndex].traditional;
    const sameAsLast = currentWord === wordContent[nextWordIndex].traditional;
    const allowLast =
      sameAsLast && wordCompletedCache.size === wordContent.length - 1;

    /**
     * NOTE: Only allow last if the last failed word is the only word remaining
     * in the quiz. Otherwise, do not allow the last word to be chosen as the
     * next word (this is possibly if the user had failed the last word).
     */
    if (
      !wordCompletedCache.has(nextWordIndex) &&
      (sameAsLast ? allowLast : true)
    ) {
      return nextWordIndex;
    } else {
      return this.getNextWordIndex();
    }
  };

  getRandomWordIndex = (
    min = 0,
    max = this.state.wordContent.length,
  ): number => {
    return randomInRange(min, max);
  };

  startConfettiAnimation = () => {
    if (this.CONFETTI_REF) {
      this.CONFETTI_REF.startConfetti();
    }
  };

  stopConfettiAnimation = () => {
    if (this.CONFETTI_REF) {
      this.CONFETTI_REF.stopConfetti();
    }
  };

  focusTextInput = () => {
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

const ProgressText = styled.Text<any>`
  font-size: 10px;
  justify-content: center;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.white : COLORS.darkText};
`;

const ActionIconStyle = {
  fontSize: 20,
  height: 22,
  color: "white",
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(QuizScreenComponent),
);
