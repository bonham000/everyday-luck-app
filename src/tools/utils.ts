import {
  DrawerLockMode,
  NavigationActions,
  StackActions,
} from "react-navigation";

import ENGLISH_WORDS from "@src/constants/EnglishWords";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ListScore,
  QUIZ_TYPE,
  ScoreStatus,
  WordDictionary,
} from "@src/GlobalState";
import {
  convertChineseToPinyin,
  fetchWordPronunciation,
  fetchWordTranslation,
} from "@src/tools/api";
import CONFIG from "@src/tools/config";
import {
  AudioItem,
  ENGLISH,
  HSKListSet,
  languageCode,
  Lesson,
  LessonSet,
  LessonSummaryType,
  Option,
  OptionType,
  ResultType,
  SIMPLIFIED_CHINESE,
  SoundFileResponse,
  TRADITIONAL_CHINESE,
  TranslationsData,
  Word,
} from "@src/tools/types";

/**
 * Helper to assert unreachable code.
 */
export const assertUnreachable = (x: never): never => {
  throw new Error(`Unreachable code! -> ${JSON.stringify(x)}`);
};

/**
 * Return a random number for the given range.
 *
 * @param min Minimum range limit
 * @param max maximum range limit
 * @returns random number within given range
 */
export const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Shuffle an array of values.
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
 * Reset the navigation stack to the given route name.
 *
 * @param routeName to reset navigation to
 * @returns navigation reset action
 */
export const resetNavigation = (routeName: ROUTE_NAMES) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
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
      const { english_alternate_choices } = word;
      const alternateEnglishWords =
        english_alternate_choices.length < 4
          ? ENGLISH_WORDS.filter(
              englishWord => englishWord.toLowerCase() in wordDictionary,
            )
          : english_alternate_choices;

      choices = [
        word,
        ...knuthShuffle(alternateEnglishWords)
          .slice(0, 4)
          .map(choice => ({
            english: choice,
            ...wordDictionary[choice.toLowerCase()],
          })),
      ];

      break;
    } else {
      if (
        !chosen.has(idx) &&
        option.english !== word.english &&
        option.pinyin !== word.pinyin &&
        option.simplified !== word.simplified &&
        option.traditional !== word.traditional &&
        option.traditional.length === word.traditional.length
      ) {
        chosen.add(idx);
        choices = choices.concat(option);
      }
    }
  }

  return knuthShuffle(choices);
};

/**
 * Determines the unlocked lesson for a user given their score status.
 *
 * @param userScoreStatus
 * @returns index of final unlocked HSK list
 */
export const getFinalUnlockedListKey = (
  userScoreStatus: ScoreStatus,
): number => {
  return [
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
};

/**
 * Determine the final unlocked lesson in an HSK list.
 *
 * @param lesson
 * @param listIndex
 * @param userScoreStatus
 * @param appDifficultySetting
 * @param returns index of final unlocked lesson
 */
export const determineFinalUnlockedLesson = (
  lesson: Lesson,
  listIndex: number,
  userScoreStatus: ScoreStatus,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
): number => {
  const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
  if (listScore.complete) {
    return lesson.length;
  }

  const completedWords = listScore.number_words_completed;
  const userLessonSize = convertAppDifficultyToLessonSize(appDifficultySetting);

  return Math.floor(completedWords / userLessonSize);
};

/**
 * Index mapping of score keys to list index.
 */
const SCORES_INDEX_MAP: ReadonlyArray<string> = [
  "list_02_score",
  "list_03_score",
  "list_04_score",
  "list_05_score",
  "list_06_score",
];

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
  userScoreStatus: ScoreStatus,
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
 * @param userScoreStatus
 * @returns true if lesson has been completed
 */
export const isLessonComplete = (userScoreStatus: ScoreStatus): boolean => {
  return (
    userScoreStatus.mc_english &&
    userScoreStatus.mc_mandarin &&
    userScoreStatus.quiz_text &&
    userScoreStatus.mandarin_pronunciation
  );
};

/**
 * Determine experience points for completing a lesson. Result is random, within
 * a range.
 *
 * @param quizType type of completed quiz
 * @returns lessonType lesson type
 */
export const getExperiencePointsForLesson = (
  quizType: QUIZ_TYPE,
  lessonType: LessonSummaryType,
): number => {
  const MIN = 500;
  const MAX = quizType === QUIZ_TYPE.QUIZ_TEXT ? 1250 : 750;
  const OFFSET = lessonType === "LESSON" ? 500 : 0;
  return randomInRange(MIN, MAX - OFFSET);
};

/**
 * Helper to determine if the user is on the SignIn screen.
 *
 * @param navigationState
 * @returns true if user is on the SignIn screen.
 */
const isOnSignInScreen = (navigationState: any): boolean => {
  try {
    if (navigationState.routes[0].routeName === ROUTE_NAMES.SIGNIN) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const LOCKED = "locked-closed";
const UNLOCKED = "unlocked";

/**
 * Helper to get the locked state for the side menu drawer.
 *
 * @param navigation
 * @returns docker lock state
 */
export const getDrawerLockedState = (navigation: any): DrawerLockMode => {
  const isOnSignIn = isOnSignInScreen(navigation.state);
  const drawerLockMode = isOnSignIn
    ? LOCKED
    : navigation.state.index > 0
    ? LOCKED
    : UNLOCKED;
  return drawerLockMode;
};

/**
 * Derive random lesson set for game mode.
 *
 * @param lists HSKListSet of content
 * @param unlockedLessonIndex final unlocked lesson index
 * @param appDifficultySetting user difficulty setting
 * @param userScoreStatus user scores
 * @returns random lesson containing 25 items
 */
export const getDailyChallengeQuizSet = (
  lists: HSKListSet,
  unlockedLessonIndex: number,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
  userScoreStatus: ScoreStatus,
): Lesson => {
  const quizSize = convertAppDifficultyToLessonSize(appDifficultySetting);
  const allWordContent = getAllUnlockedWordContent(
    lists,
    unlockedLessonIndex,
    userScoreStatus,
  );
  return knuthShuffle(allWordContent).slice(0, quizSize);
};

/**
 * Derive random lesson set for game mode.
 *
 * @param lists HSKListSet of content
 * @param unlockedLessonIndex final unlocked lesson index
 * @param userScoreStatus user scores
 * @returns merged review content of all unlocked lessons
 */
export const getReviewLessonSet = (
  lists: HSKListSet,
  unlockedLessonIndex: number,
  userScoreStatus: ScoreStatus,
) => {
  return getAllUnlockedWordContent(lists, unlockedLessonIndex, userScoreStatus);
};

/**
 * Helper which reduces all the HSK list content to only those
 * words which the use has already completed, and returns these
 * as a single flattened array.
 *
 * @param lists HSKListSet of content
 * @param unlockedLessonIndex final unlocked lesson index
 * @param userScoreStatus user scores
 * @returns merged word lists of all unlocked words
 */
const getAllUnlockedWordContent = (
  lists: HSKListSet,
  unlockedLessonIndex: number,
  userScoreStatus: ScoreStatus,
): ReadonlyArray<Word> => {
  const completedLists =
    unlockedLessonIndex > 0
      ? lists
          .slice(0, unlockedLessonIndex)
          .map(list => list.content)
          .reduce((flattened, lesson) => flattened.concat(lesson))
      : [];
  const finalUnlockedList = lists[unlockedLessonIndex];
  const finalListScore = mapListIndexToListScores(
    unlockedLessonIndex,
    userScoreStatus,
  );
  const completedWords = finalListScore.number_words_completed;
  const finalListWords = finalUnlockedList.content.slice(0, completedWords);
  return completedLists.concat(finalListWords);
};

const API_RATE_LIMIT_REACHED = "API_RATE_LIMIT_REACHED";

/**
 * Parse a response from the Forzo API and return audio file uri,
 * wrapped in an Option result type in case no result can be found.
 *
 * @response SoundFileResponse
 * @returns `Option<string>` with uri
 */
export const transformSoundFileResponse = (
  response: SoundFileResponse,
): Option<ReadonlyArray<AudioItem>> => {
  if (Array.isArray(response)) {
    return {
      message: API_RATE_LIMIT_REACHED,
      type: OptionType.EMPTY,
    };
  } else {
    // @ts-ignore
    const sortedByHits = response.items.sort((a: AudioItem, b: AudioItem) =>
      a.hits > b.hits ? -1 : 1,
    );
    return {
      data: sortedByHits,
      type: OptionType.OK,
    };
  }
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
 * Helper to prefetch audio recordings for a words list.
 *
 * @param words
 * @returns word audio map of results
 */
export const prefetchWordsList = async (words: ReadonlyArray<string>) => {
  const total = words.length;
  let processed = 0;

  console.log(`\nStarting to process words list ---`);
  console.log(`Processing ${total} words:\n`);

  let failureCount = 0;
  const failedThreshold = 5;

  const processWord = async (word: string) => {
    console.log(`- Processing ${word}`);
    const pronunciationResult = await fetchWordPronunciation(word);
    switch (pronunciationResult.type) {
      case ResultType.OK:
        const uriResult = transformSoundFileResponse(pronunciationResult.data);
        if (uriResult.type === OptionType.OK) {
          processed++;
          console.log(
            `- Processing completed - ${
              uriResult.data.length
            } results obtained`,
          );
          return { word, soundData: uriResult.data };
        } else {
          failureCount++;
          return null;
        }
      case ResultType.ERROR:
        failureCount++;
        return null;
    }
  };

  const results: ReadonlyArray<{
    word: string;
    soundData: ReadonlyArray<AudioItem>;
  }> = [];

  for (const word of words) {
    if (failureCount > failedThreshold) {
      console.log("Errors encountered - aborting!");
      break;
    }

    await delay(100);
    const audioResult = await processWord(word);
    // @ts-ignore
    results.push(audioResult);
  }

  const flattenedResults = results.reduce((wordMap, uriResult) => {
    if (uriResult) {
      return {
        ...wordMap,
        [uriResult.word]: uriResult.soundData,
      };
    }

    return wordMap;
  }, {});

  console.log(`\nProcessed a total of ${processed} out of ${total} words -`);

  return flattenedResults;
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
  return `${CONFIG.DRAGON_URI}/static/${encodedFileKey}.mp3`;
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
 * Arbitrary delay function to pause for some given time.
 *
 * @param time to delay
 * @returns execution after the given delay has occurred
 */
export const delay = (time: number = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("delayed!"), time);
  });
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
  switch (setting) {
    case APP_DIFFICULTY_SETTING.EASY:
      return 10;
    case APP_DIFFICULTY_SETTING.MEDIUM:
      return 25;
    case APP_DIFFICULTY_SETTING.HARD:
      return 50;
    default:
      return 25;
  }
};

/**
 * Divide the lesson content into individual lesson batches.
 *
 * @param lesson
 * @param appDifficultySetting
 * @returns batched lists based on appropriate app lesson size
 */
export const formatHskListContent = (
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
  userScoreStatus: ScoreStatus,
  listIndex: number,
) => {
  const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
  const listCompleted = listScore.complete;
  const mcEnglish = listCompleted
    ? true
    : isFinalLesson
    ? userScoreStatus.mc_english
    : true;
  const mcMandarin = listCompleted
    ? true
    : isFinalLesson
    ? userScoreStatus.mc_mandarin
    : true;
  const quizText = listCompleted
    ? true
    : isFinalLesson
    ? userScoreStatus.quiz_text
    : true;
  const mandarinPronunciation = listCompleted
    ? true
    : isFinalLesson
    ? userScoreStatus.mandarin_pronunciation
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
