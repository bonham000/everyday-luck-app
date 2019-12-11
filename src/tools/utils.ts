import { ConnectionInfo } from "react-native";

import EVENTS from "@src/constants/AnalyticsEvents";
import ENGLISH_WORDS from "@src/constants/EnglishWords";
import HSK_LISTS, {
  ListScore,
  ListScoreSet,
  SCORES_INDEX_MAP,
} from "@src/lessons";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  DIFFICULTY_TO_LESSON_SIZE_MAP,
  QUIZ_TYPE,
  UserSettings,
  WordDictionary,
} from "@src/providers/GlobalStateContext";
import { convertChineseToPinyin, fetchWordTranslation } from "@src/tools/api";
import CONFIG from "@src/tools/config";
import {
  ENGLISH,
  HSKListSet,
  languageCode,
  Lesson,
  LessonSet,
  LessonSummaryType,
  SIMPLIFIED_CHINESE,
  TRADITIONAL_CHINESE,
  TranslationsData,
  User,
  UserJson,
  Word,
} from "@src/tools/types";

/**
 * Helper to assert unreachable code.
 */
export const assertUnreachable = (x: never): never => {
  throw new Error(`Unreachable code! -> ${JSON.stringify(x)}`);
};

/**
 * Return a random number for the given range, inclusive of the lower
 * bound. For instance, a range 0..10 can return 0 or 9.
 *
 * @param min Minimum range limit
 * @param max maximum range limit
 * @returns random number within given range
 */
export const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Filter function for searching words list and matching based on
 * mandarin, pinyin, or english input.
 *
 * @param searchValue value to search for
 * @returns a function which takes a `Word` item and searches that word
 * content for the given `searchValue`
 */
export const filterBySearchTerm = (searchValue: string) => (word: Word) => {
  const term = searchValue.toLowerCase();
  const { simplified, traditional, pinyin, english } = word;
  return (
    traditional.toLowerCase().includes(term) ||
    simplified.toLowerCase().includes(term) ||
    pinyin.toLowerCase().includes(term) ||
    english.toLowerCase().includes(term)
  );
};

/**
 * Map words to list items for view all screen.
 *
 * @param word
 * @returns word with key index added
 */
export const mapWordsForList = (word: Word) => ({
  ...word,
  key: word.traditional,
});

/**
 * Shuffle an array of items.
 *
 * @param array input
 * @returns input array, shuffled
 */
export const knuthShuffle = <T>(array: ReadonlyArray<T>): ReadonlyArray<T> => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    // @ts-ignore
    // tslint:disable-next-line
    array[currentIndex] = array[randomIndex];
    // @ts-ignore
    // tslint:disable-next-line
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
 * Derive shuffled multiple choice options given a word and all the
 * language content.
 *
 * @param word given input word
 * @param alternates Lesson of word alternates to generate choices
 * @param wordDictionary dictionary mapping of words
 * @param mcType multiple choice quiz type
 * @returns array of random alternate word choices
 */
export const getAlternateChoices = (
  word: Word,
  alternates: Lesson,
  wordDictionary: WordDictionary,
  mcType: QUIZ_TYPE,
) => {
  let idx: number;
  let option: Word;
  const chosen: Set<number> = new Set();
  let choices: ReadonlyArray<Word> = [word];

  while (choices.length < 4) {
    idx = randomInRange(0, alternates.length);
    option = alternates[idx];

    if (mcType === QUIZ_TYPE.ENGLISH) {
      /**
       * Use different logic if the lesson is English recognition.
       */
      choices = getEnglishAlternateWords(word, wordDictionary);
      break;
    } else if (!chosen.has(idx) && !areWordsEqual(option, word)) {
      /**
       * Try to match choices with a similar length to the selected word,
       * but only up to words of length 3.
       */
      if (word.simplified.length < 4) {
        if (option.simplified.length === word.simplified.length) {
          chosen.add(idx);
          choices = choices.concat(option);
        }
      } else {
        chosen.add(idx);
        choices = choices.concat(option);
      }
    }
  }

  return knuthShuffle(choices);
};

/**
 * Helper to derive alternate English word choices for a quiz question.
 * Rely or provided alternate words first and fallback back to a random
 * selection. Ensure only unique English words are chosen.
 *
 * @param word `Word` in quiz
 * @param wordDictionary dictionary of lesson content
 * @returns `Lesson` subset of word choices for this quiz question
 */
const getEnglishAlternateWords = (
  word: Word,
  wordDictionary: WordDictionary,
): Lesson => {
  const { english_alternate_choices } = word;
  const alternateEnglishWords =
    english_alternate_choices.length < 4
      ? ENGLISH_WORDS.filter(
          englishWord => englishWord.toLowerCase() in wordDictionary,
        )
      : english_alternate_choices;

  let idx: number;
  let option: string;
  const chosen: Set<string> = new Set([word.english]);
  let choices: ReadonlyArray<string> = [];

  while (choices.length < 4) {
    idx = randomInRange(0, alternateEnglishWords.length);
    option = alternateEnglishWords[idx];

    if (!chosen.has(option)) {
      chosen.add(option);
      choices = choices.concat(option);
    }
  }

  return [
    word,
    ...knuthShuffle(choices).map(choice => ({
      english: choice,
      ...wordDictionary[choice.toLowerCase()],
    })),
  ];
};

/**
 * Compare two different word objects and determine if they are
 * equivalent or not.
 *
 * @param wordA
 * @param wordB
 * @returns true if `wordA` and `wordB` are equivalent
 */
const areWordsEqual = (wordA: Word, wordB: Word): boolean => {
  return (
    wordA.english === wordB.english &&
    wordA.pinyin === wordB.pinyin &&
    wordA.simplified === wordB.simplified &&
    wordA.traditional === wordB.traditional
  );
};

/**
 * Determines the unlocked lesson for a user given their score status.
 *
 * @param userScoreStatus
 * @returns index of final unlocked HSK list
 */
export const getFinalUnlockedListScores = (
  userScoreStatus: ListScoreSet,
): ListScore => {
  const result = [
    userScoreStatus.list_02_score,
    userScoreStatus.list_03_score,
    userScoreStatus.list_04_score,
    userScoreStatus.list_05_score,
    userScoreStatus.list_06_score,
    // @ts-ignore
  ].reduce((finalIndex, current) => {
    return finalIndex ? finalIndex : !current.complete ? current : null;
  }, null);

  return result;
};

/**
 * Determines the unlocked lesson for a user given their score status.
 *
 * @param userScoreStatus
 * @returns index of final unlocked HSK list
 */
export const getFinalUnlockedListKey = (
  userScoreStatus: ListScoreSet,
): number => {
  const result = [
    userScoreStatus.list_02_score,
    userScoreStatus.list_03_score,
    userScoreStatus.list_04_score,
    userScoreStatus.list_05_score,
    userScoreStatus.list_06_score,

    // @ts-ignore
  ].reduce((finalIndex, current) => {
    return typeof finalIndex === "number"
      ? finalIndex
      : !current.complete
      ? current.list_index
      : null;
  }, null);

  return typeof result === "number" ? result : 5;
};

/**
 * Determine the final unlocked lesson in an HSK list.
 *
 * @param list
 * @param listIndex
 * @param userScoreStatus
 * @param appDifficultySetting
 * @param returns index of final unlocked lesson
 */
export const determineFinalUnlockedLessonInList = (
  list: Lesson,
  listIndex: number,
  userScoreStatus: ListScoreSet,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
): number => {
  const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
  if (listScore.complete) {
    return list.length;
  }

  const completedWords = listScore.number_words_completed;
  const userLessonSize = convertAppDifficultyToLessonSize(appDifficultySetting);

  return Math.floor(completedWords / userLessonSize);
};

/**
 * Get the list score key from the given list index.
 *
 * @param index list index
 * @returns score key
 */
export const getListScoreKeyFromIndex = (index: number) => {
  return SCORES_INDEX_MAP[index];
};

/**
 * Map a list index to the list scores object.
 *
 * @param index list index
 * @param userScoreStatus
 * @returns score detail for the list
 */
export const mapListIndexToListScores = (
  index: number,
  userScoreStatus: ListScoreSet,
): ListScore => {
  if (index === Infinity) {
    const result = { complete: false };
    return result as ListScore;
  }

  const key = getListScoreKeyFromIndex(index);
  // @ts-ignore
  return userScoreStatus[key] as ListScore;
};

/**
 * Determine if a lesson is complete.
 *
 * @param listScore
 * @returns true if lesson has been completed
 */
export const isLessonComplete = (listScore: ListScore): boolean => {
  return (
    listScore.mc_english &&
    listScore.mc_mandarin &&
    listScore.quiz_text &&
    listScore.mandarin_pronunciation
  );
};

const DIFFICULTY_MULTIPLIERS = {
  [APP_DIFFICULTY_SETTING.EASY]: 1,
  [APP_DIFFICULTY_SETTING.MEDIUM]: 2,
  [APP_DIFFICULTY_SETTING.HARD]: 3,
};

/**
 * Determine experience points for completing a lesson. Result is random,
 * within a range. Adjust for app difficulty setting and if this is the
 * first completion of this quiz.
 *
 * @param quizType type of completed quiz
 * @returns lessonType lesson type
 */
export const calculateExperiencePointsForLesson = (
  firstPass: boolean,
  perfectScore: boolean,
  quizType: QUIZ_TYPE,
  lessonType: LessonSummaryType,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
): number => {
  const MIN: number = 15;
  let MAX: number;
  if (lessonType === "OPT_OUT_CHALLENGE") {
    MAX = 1000;
  } else if (lessonType === "DAILY_QUIZ") {
    MAX = 500;
  } else if (quizType === QUIZ_TYPE.QUIZ_TEXT) {
    MAX = 35;
  } else {
    MAX = 20;
  }

  const OFFSET = lessonType === "LESSON" ? 25 : 0;
  const result = randomInRange(MIN, MAX - OFFSET);

  let multipliedResult = result;
  if (lessonType === "LESSON" || lessonType === "SUMMARY") {
    multipliedResult = result * DIFFICULTY_MULTIPLIERS[appDifficultySetting];
  }

  /**
   * Add bonus points for firstPass and perfectScore:
   */
  if (firstPass) {
    multipliedResult += 15;
  } else if (perfectScore) {
    multipliedResult += 5;
  }

  return multipliedResult;
};

export interface DeriveLessonContentArgs {
  lists: HSKListSet;
  unlockedListIndex: number;
  userScoreStatus: ListScoreSet;
  appDifficultySetting: APP_DIFFICULTY_SETTING;
  limitToCurrentList?: boolean;
}

/**
 * Derive random lesson set for game mode.
 *
 * @param lists HSKListSet of all content
 * @param unlockedListIndex final unlocked list index
 * @param appDifficultySetting user difficulty setting
 * @param userScoreStatus current user scores
 * @param limitToCurrentList whether results should be limited to current list or not
 * @returns randomized lesson content based on the parameters
 */
export const getRandomQuizChallenge = (
  args: DeriveLessonContentArgs,
): Lesson => {
  const quizSize = convertAppDifficultyToLessonSize(args.appDifficultySetting);
  const allWordContent = getAllUnlockedWordContent(args);
  return knuthShuffle(allWordContent).slice(0, quizSize);
};

/**
 * Derive random lesson set for game mode.
 *
 * @param `DeriveLessonContentArgs`
 * @returns merged review content of all unlocked lessons
 */
export const getReviewLessonSet = (args: DeriveLessonContentArgs) => {
  return getAllUnlockedWordContent(args);
};

/**
 * Helper which reduces all the HSK list content to only those
 * words which the use has already completed, and returns these
 * as a single flattened array.
 *
 * @param `DeriveLessonContentArgs`
 * @returns merged word lists of all unlocked words
 */
const getAllUnlockedWordContent = (
  args: DeriveLessonContentArgs,
): ReadonlyArray<Word> => {
  const {
    lists,
    unlockedListIndex,
    userScoreStatus,
    appDifficultySetting,
    limitToCurrentList,
  } = args;

  /**
   * If limited to current list then just return that list content. This is used for
   * the HSK opt-out tests which cover just the content specific to that HSK list.
   */
  if (limitToCurrentList) {
    return lists[unlockedListIndex].content;
  }

  /**
   * Otherwise gather all the unlocked words the user has completed so far and
   * flatten and return the results.
   */
  const completedLists =
    unlockedListIndex > 0
      ? lists
          .slice(0, unlockedListIndex)
          .map(list => list.content)
          .reduce((flattened, lesson) => flattened.concat(lesson))
      : [];
  const finalUnlockedList = lists[unlockedListIndex];
  const finalListScore = mapListIndexToListScores(
    unlockedListIndex,
    userScoreStatus,
  );
  const completedWords = finalListScore.number_words_completed;
  const lessonSize = convertAppDifficultyToLessonSize(appDifficultySetting);
  const finalListWords = finalUnlockedList.content.slice(
    0,
    completedWords || lessonSize,
  );

  return completedLists.concat(finalListWords);
};

/**
 * Parse the app language setting in a human readable way.
 *
 * @param languageSetting
 * @returns parsed human readable string
 */
export const formatUserLanguageSetting = (
  languageSetting: APP_LANGUAGE_SETTING,
): string => {
  return `${languageSetting.slice(0, 1).toUpperCase()}${languageSetting.slice(
    1,
  )} Chinese`;
};

/**
 * Get the alternate language setting given one.
 *
 * @param languageSetting
 * @returns languageSetting alternate
 */
export const getAlternateLanguageSetting = (
  languageSetting: APP_LANGUAGE_SETTING,
): APP_LANGUAGE_SETTING => {
  return languageSetting === APP_LANGUAGE_SETTING.SIMPLIFIED
    ? APP_LANGUAGE_SETTING.TRADITIONAL
    : APP_LANGUAGE_SETTING.SIMPLIFIED;
};

/**
 * Helper to batch a list based on some size parameter.
 *
 * @param data list to batch
 * @param batchSize size of batches
 * @returns batched result
 */
const batchList = <T>(
  data: ReadonlyArray<T>,
  batchSize: number = 10,
): ReadonlyArray<ReadonlyArray<T>> => {
  let result: ReadonlyArray<ReadonlyArray<T>> = [];

  for (let i = 0; i < data.length; i += batchSize) {
    result = result.concat([data.slice(i, i + batchSize)]);
  }

  return result;
};

/**
 * Flatten the lesson set data into a single array of word items.
 *
 * @param lessons
 * @returns lesson flattened lesson data
 */
export const flattenLessonSet = (lessons: HSKListSet): Lesson => {
  return lessons
    .map(list => list.content)
    .reduce((flat, lesson) => flat.concat(lesson));
};

/**
 * Create the file path url for a word mp3 file recording.
 *
 * @param fileKey for word
 * @returns encoded URL to fetch mp3 file
 */
export const getAudioFileUrl = (fileKey: string): string => {
  const encodedFileKey = encodeURIComponent(fileKey);
  return `${CONFIG.AMAZON_CLOUD_FRONT}/${encodedFileKey}.mp3`;
};

/**
 * Map all lesson words to a dictionary to have instant lookup of a
 * word object given traditional, simplified, or english keys.
 *
 * @param lessons
 * @returns word dictionary object
 */
export const createWordDictionaryFromLessons = (
  lessons: HSKListSet,
): WordDictionary => {
  const allWords = flattenLessonSet(lessons);

  const wordDictionary: WordDictionary = {};

  for (const word of allWords) {
    // tslint:disable-next-line
    wordDictionary[word.traditional] = word;
    // tslint:disable-next-line
    wordDictionary[word.simplified] = word;
    // tslint:disable-next-line
    wordDictionary[word.english.toLowerCase()] = word;
  }

  return wordDictionary;
};

/**
 * Get the lesson size for the given app difficulty setting.
 *
 * @param setting current app difficulty setting
 * @returns fixed lesson size based on app difficulty
 */
export const convertAppDifficultyToLessonSize = (
  setting: APP_DIFFICULTY_SETTING,
) => {
  return DIFFICULTY_TO_LESSON_SIZE_MAP[setting];
};

/**
 * Divide the lesson content into individual lesson batches.
 *
 * @param lesson
 * @param appDifficultySetting
 * @returns batched lists based on appropriate app lesson size
 */
export const adjustListContentByDifficultySetting = (
  lesson: Lesson,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
): LessonSet => {
  const lessonSize = convertAppDifficultyToLessonSize(appDifficultySetting);
  return batchList(lesson, lessonSize);
};

/**
 * Capitalize a string. For instance, `hello, NICE to MEET you.` would be
 * capitalized to `Hello, nice to meet you.`.
 *
 * @param value string to capitalize
 * @returns capitalized string.
 */
export const capitalize = (value: string): string => {
  return value
    .slice(0, 1)
    .toUpperCase()
    .concat(value.toLowerCase().slice(1));
};

/**
 * Derive lesson summary score status for any lesson.
 *
 * @param isFinalLesson boolean for final lesson
 * @param userScoreStatus user score status
 * @param listIndex current list index
 * @returns scores object for 4 quiz types
 */
export const getLessonSummaryStatus = (
  isFinalLesson: boolean,
  userScoreStatus: ListScoreSet,
  listIndex: number,
) => {
  const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
  const listCompleted = listScore.complete;
  const mcEnglish = listCompleted
    ? true
    : isFinalLesson
    ? listScore.mc_english
    : true;
  const mcMandarin = listCompleted
    ? true
    : isFinalLesson
    ? listScore.mc_mandarin
    : true;
  const quizText = listCompleted
    ? true
    : isFinalLesson
    ? listScore.quiz_text
    : true;
  const mandarinPronunciation = listCompleted
    ? true
    : isFinalLesson
    ? listScore.mandarin_pronunciation
    : true;

  return {
    mcEnglish,
    mcMandarin,
    quizText,
    mandarinPronunciation,
  };
};

/**
 * Handle translating a word into all the language variants. Takes one source
 * and returns the word translated in English, Traditional Chinese, and Simplified
 * Chinese.
 *
 * @param word word to translate
 * @param source language source to translate from
 * @returns `Promise<TranslationsData>` translation result data
 */
export const translateWord = async (
  word: string,
  source: languageCode,
): Promise<TranslationsData> => {
  let needToTranslate: ReadonlyArray<languageCode> = [];

  if (source === ENGLISH) {
    needToTranslate = [TRADITIONAL_CHINESE, SIMPLIFIED_CHINESE];
  } else if (source === TRADITIONAL_CHINESE) {
    needToTranslate = [SIMPLIFIED_CHINESE, ENGLISH];
  } else if (source === SIMPLIFIED_CHINESE) {
    needToTranslate = [TRADITIONAL_CHINESE, ENGLISH];
  }

  const translationQueue = needToTranslate.map(async target => {
    const translation = await fetchWordTranslation(word, source, target);
    return {
      [target]: translation[0],
    };
  });

  const result = (await Promise.all(translationQueue))
    .concat({
      [source]: word,
    })
    .reduce((translations, translationResult) => {
      return {
        ...translations,
        ...translationResult,
      };
    }, {});

  const data = {
    ...((result as unknown) as TranslationsData),
    pinyin: await convertChineseToPinyin(result.traditional),
  };

  return data;
};

/**
 * Parse network status result to determine if the network is currently
 * online or not.
 *
 * @param type ConnectionInfo type result
 * @param true if the network is online
 */
export const isNetworkConnected = (type: ConnectionInfo["type"]): boolean => {
  return type !== "none";
};

/**
 * Convert UserJson to User.
 *
 * @param userJson `UserJson` data
 * @returns `User` formatted user data
 */
export const transformUserJson = (userJson: UserJson): User => {
  return {
    ...userJson,
    settings: JSON.parse(userJson.settings),
    score_history: JSON.parse(userJson.score_history),
  };
};

export interface QuizSuccessToasts {
  primary: string;
  secondary: string;
}

/**
 * Get the quiz success toasts.
 *
 * @param lessonCompleted
 * @param firstPass
 * @param lessonType
 * @param experience
 * @returns `QuizSuccessToasts`
 */
export const getQuizSuccessToasts = (
  lessonCompleted: boolean,
  firstPass: boolean,
  lessonType: LessonSummaryType,
  experience: number,
  perfectScore: boolean,
  allComplete: boolean,
): QuizSuccessToasts => {
  /**
   * Define primary title string:
   */
  let primary: string = "";
  if (allComplete) {
    primary = "Extraordinary!!! 🏆";
  } else if (lessonCompleted) {
    primary = "The next lesson is unlocked! 🥇";
  } else if (lessonType === "OPT_OUT_CHALLENGE") {
    if (perfectScore) {
      primary = "Incredible!!! You're a master!";
    } else {
      primary = "You passed but not with a perfect score!";
    }
  } else if (lessonType === "DAILY_QUIZ") {
    primary = "非常好！ 👏👏👏";
  } else if (firstPass) {
    primary = "Amazing! You passed this lesson! 💯";
  } else {
    primary = "You finished the quiz!";
  }

  /**
   * Define secondary title string:
   */
  let secondary: string = "";
  if (allComplete) {
    secondary =
      "You've completed all the content! You must be fluent by now! Congratulations!!!";
  } else if (lessonCompleted) {
    secondary = `Great - keep going! 很好! You earned ${experience} experience points!`;
  } else if (lessonType === "OPT_OUT_CHALLENGE") {
    if (perfectScore) {
      secondary = "The next HSK Level will now be unlocked! 💫💫💫";
    } else {
      secondary =
        "You can try again anytime to still unlock the HSK Level, good luck!";
    }
  } else if (lessonType === "DAILY_QUIZ") {
    if (perfectScore) {
      secondary = `You gained ${experience} points! Keep reviewing to master more vocabulary!`;
    } else {
      secondary = "Great job! Keep trying and reviewing more!";
    }
  } else if (firstPass) {
    secondary = `Congratulations! You gained ${experience} experience points!`;
  } else {
    secondary =
      "All words completed, 很好！ Try again to get a perfect score to unlock the next lesson.";
  }

  return {
    primary,
    secondary,
  };
};

/**
 * Fetch lesson content.
 */
export const fetchLessonSet = (): HSKListSet => {
  return HSK_LISTS;
};

interface QuizInputResult {
  correct: boolean;
  correctWord: Word;
}

/**
 * Given user input and a quiz word, determine if the user input is correct. This
 * method accounts for the possibility that the user entered Chinese characters
 * which match the English word but which do not match the provided word, for
 * instance 认为 and 以为 both translate to the English word "think".
 *
 * Without manually
 * improving the translations (subjective and time consuming), this heuristic
 * should help avoid the situation where a user could miss these words because
 * they do not know which Chinese characters are intended.
 *
 * @param input user entered string answer
 * @param word quiz word
 * @param languageSetting user language setting
 * @param wordDictionary global word dictionary of all content
 * @returns `QuizInputResult` indicating correctness of user input
 */
export const determineAnyPossibleCorrectAnswerForFreeInput = (
  input: string,
  word: Word,
  languageSetting: APP_LANGUAGE_SETTING,
  wordDictionary: WordDictionary,
): QuizInputResult => {
  /**
   * The answer matches the provided quiz word.
   */
  if (input === word[languageSetting]) {
    return {
      correct: true,
      correctWord: word,
    };
  } else if (input in wordDictionary) {
    /**
     * The answer doesn't match the provided quiz word, but matches
     * some other word with the same English meaning.
     *
     * It's possible the answer does not match an English key exactly,
     * but the definitions (word) still overlaps - try to look this up
     * by matching against all English keys string includes?
     */
    const lookup = wordDictionary[input];
    if (
      lookup.english.toLowerCase().includes(word.english.toLowerCase()) ||
      word.english.toLowerCase().includes(lookup.english.toLowerCase())
    ) {
      return {
        correct: true,
        correctWord: lookup,
      };
    }
  }

  /**
   * The answer doesn't match any of our words. If COULD still be correct
   * and match a word we don't have in our local lesson dictionary, but it's
   * hard to know that so we have to return that the answer is invalid and
   * default to the provided word for the correctValue.
   */
  return {
    correct: false,
    correctWord: word,
  };
};

/**
 * Map a user settings change to the associated analytics event.
 *
 * @param setting Settings data changed
 * @returns `EVENTS` Analytics event type to record
 */
export const mapSettingsChangeToAnalyticsEvent = (
  setting: Partial<UserSettings>,
): EVENTS | null => {
  switch (setting) {
    case "disable_audio":
      return EVENTS.TOGGLE_AUDIO_SETTING;
    case "auto_proceed_question":
      return EVENTS.TOGGLE_AUTO_PROCEED_QUIZ;
    case "language_setting":
      return EVENTS.SET_APP_LANGUAGE;
    case "app_difficulty_setting":
      return EVENTS.SET_APP_DIFFICULTY;
  }

  return null;
};

/**
 * Determine if the user has completed all the content.
 *
 * @param scores Score history
 * @returns true if all lists are complete.
 */
export const hasUserCompletedAllLists = (scores: ListScoreSet): boolean => {
  return (
    scores.list_02_score.complete &&
    scores.list_03_score.complete &&
    scores.list_04_score.complete &&
    scores.list_05_score.complete &&
    scores.list_06_score.complete
  );
};

/**
 * Helper to determine if an email address is valid or not.
 *
 * @param email
 * @returns true if email is valid
 */
export const isEmailValid = (email: string): boolean => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
