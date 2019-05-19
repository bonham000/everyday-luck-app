import {
  DrawerLockMode,
  NavigationActions,
  StackActions,
} from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  LessonScoreType,
  ListScore,
  ScoreStatus,
  WordDictionary,
} from "@src/GlobalState";
import {
  AudioItem,
  HSKList,
  HSKListSet,
  Lesson,
  LessonSet,
  LessonSummaryType,
  Option,
  OptionType,
  ResultType,
  SoundFileResponse,
  Word,
} from "@src/tools/types";
import { fetchWordPronunciation } from "./api";
import CONFIG from "./config";

export const assertUnreachable = (x: never): never => {
  throw new Error(`Unreachable code! -> ${JSON.stringify(x)}`);
};

/**
 * Return a random number for the given range.
 */
export const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Shuffle an array of values.
 */
export const knuthShuffle = (array: ReadonlyArray<any>): ReadonlyArray<any> => {
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
 */
export const filterBySearchTerm = (searchValue: string) => (word: Word) => {
  const term = searchValue.toLowerCase();
  const { traditional, pinyin, english } = word;
  return (
    traditional.toLowerCase().includes(term) ||
    pinyin.toLowerCase().includes(term) ||
    english.toLowerCase().includes(term)
  );
};

/**
 * Map words to list items for view all screen.
 */
export const mapWordsForList = (word: Word) => ({
  ...word,
  key: word.traditional,
});

/**
 * Reset the navigation stack to the given route name.
 */
export const resetNavigation = (routeName: ROUTE_NAMES) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
};

/**
 * Filter the words list and only return 1 character words.
 */
export const filterForOneCharacterMode = (
  words: ReadonlyArray<Word>,
): ReadonlyArray<Word> => {
  return words.filter(({ traditional }) => traditional.length === 1);
};

export const isLessonEmpty = (lesson: HSKList) => {
  return Boolean(
    lesson.content.filter(({ traditional }) => Boolean(traditional)).length,
  );
};

export const filterEmptyWords = (lesson: HSKList) => {
  return lesson.content.filter((word: Word) => Boolean(word.traditional));
};

export type MC_TYPE = "MANDARIN" | "ENGLISH" | "MANDARIN_PRONUNCIATION";

/**
 * Derive shuffled multiple choice options given a word and all the
 * language content.
 */
export const getAlternateChoices = (
  word: Word,
  alternates: Lesson,
  wordDictionary: WordDictionary,
  mcType: MC_TYPE,
) => {
  let idx: number;
  let option: Word;
  const chosen: Set<number> = new Set();
  let choices: ReadonlyArray<Word> = [word];

  while (choices.length < 4) {
    idx = randomInRange(0, alternates.length);
    option = alternates[idx];

    if (mcType === "ENGLISH") {
      choices = [
        word,
        ...knuthShuffle(word.english_alternate_choices)
          .slice(0, 4)
          .map(choice => ({
            english: choice,
            ...wordDictionary[choice],
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
        option.traditional.length <= word.traditional.length + 2
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

const SCORES_INDEX_MAP: ReadonlyArray<any> = [
  "list_02_score",
  "list_03_score",
  "list_04_score",
  "list_05_score",
  "list_06_score",
];

export const getListScoreKeyFromIndex = (index: number) => {
  return SCORES_INDEX_MAP[index];
};

export const mapListIndexToListScores = (
  index: number,
  userScoreStatus: ScoreStatus,
): ListScore => {
  const key = getListScoreKeyFromIndex(index);
  // @ts-ignore
  return userScoreStatus[key] as ListScore;
};

/**
 * Determine if a lesson is complete.
 */
export const isLessonComplete = (userScoreStatus: ScoreStatus) => {
  return (
    userScoreStatus.mc_english &&
    userScoreStatus.mc_mandarin &&
    userScoreStatus.quiz_text &&
    userScoreStatus.mandarin_pronunciation
  );
};

export const getExperiencePointsForLesson = (
  quizType: LessonScoreType,
  lessonType: LessonSummaryType,
): number => {
  const MIN = 500;
  const MAX = quizType === "quiz_text" ? 1250 : 750;
  const OFFSET = lessonType === "LESSON" ? 500 : 0;
  return randomInRange(MIN, MAX - OFFSET);
};

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

export const getDrawerLockedState = (navigation: any): DrawerLockMode => {
  const isOnSignIn = isOnSignInScreen(navigation.state);
  const drawerLockMode = isOnSignIn
    ? LOCKED
    : navigation.state.index > 0
    ? LOCKED
    : UNLOCKED;
  return drawerLockMode;
};

export const getGameModeLessonSet = (
  lessons: HSKListSet,
  unlockedLessonIndex: number,
) => {
  return knuthShuffle(
    lessons
      .slice(0, unlockedLessonIndex + 1)
      .map(list => list.content)
      .reduce((flattened, lesson) => [...flattened, ...lesson]),
  ).slice(0, 25);
};

export const getReviewLessonSet = (
  lists: HSKListSet,
  unlockedLessonIndex: number,
) => {
  return lists
    .slice(0, unlockedLessonIndex + 1)
    .map(list => list.content)
    .reduce((flattened, lesson) => flattened.concat(lesson));
};

const API_RATE_LIMIT_REACHED = "API_RATE_LIMIT_REACHED";

/**
 * Parse a response from the Forzo API and return audio file uri,
 * wrapped in an Option result type in case no result can be found.
 *
 * @response SoundFileResponse
 * @returns Option<string> with uri
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

export const prefetchWordsList = async (words: ReadonlyArray<string>) => {
  const total = words.length;
  let processed = 0;
  let apiRateLimitReached = false;

  const batches = batchList(words);

  console.log(`\nStarting to process words list ---`);
  console.log(`Processing ${total} words in ${batches.length} batches:\n`);

  const processWord = async (word: string) => {
    const pronunciationResult = await fetchWordPronunciation(word);
    switch (pronunciationResult.type) {
      case ResultType.OK:
        const uriResult = transformSoundFileResponse(pronunciationResult.data);

        if (uriResult.type === OptionType.OK) {
          processed++;
          return { word, soundData: uriResult.data };
        } else {
          if (uriResult.message === API_RATE_LIMIT_REACHED) {
            apiRateLimitReached = true;
          }
          return null;
        }
      case ResultType.ERROR:
        return null;
    }
  };

  const result = await Promise.all(
    batches.map(async (batch: ReadonlyArray<string>, index: number) => {
      if (apiRateLimitReached) {
        return null;
      } else {
        console.log(`- Processing batch ${index + 1}...`);
        return Promise.all(
          batch.map(async (word: string) => {
            if (apiRateLimitReached) {
              return null;
            } else {
              return processWord(word);
            }
          }),
        );
      }
    }),
  );

  const flattenedResults = result
    .filter(Boolean)
    .map(resultList => resultList!.filter(Boolean))
    .reduce((flat, wordsList) => flat.concat(wordsList))
    .reduce((wordMap, uriResult) => {
      if (uriResult) {
        return {
          ...wordMap,
          [uriResult.word]: uriResult.soundData,
        };
      }

      return wordMap;
    }, {});

  console.log(
    `\nProcessed a total of ${processed} out of ${total} words - (API rate limited reached: ${apiRateLimitReached})`,
  );

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
    wordDictionary[word.english] = word;
  }

  return wordDictionary;
};

export const delay = (time: number = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("delayed!"), time);
  });
};

/**
 * Get the lesson size for the given app difficulty setting.
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
 */
export const formatLessonContent = (
  lesson: Lesson,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
) => {
  const lessonSize = convertAppDifficultyToLessonSize(appDifficultySetting);
  return batchList(lesson, lessonSize);
};
