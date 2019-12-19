import uuid from "uuid/v1";

import HSK_LISTS, { ListScoreSet } from "@src/lessons";
import lessonData from "@src/lessons/02";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  GlobalStateContextValues,
  UserSettings,
} from "@src/providers/GlobalStateContext";
import { GlobalStateContextProps } from "@src/providers/GlobalStateProvider";
import { SoundRecordingProps } from "@src/providers/SoundRecordingProvider";
import {
  HSKList,
  Lesson,
  LessonScreenParams,
  ListScreenParams,
  User,
  Word,
} from "@src/tools/types";
import {
  adjustListContentByDifficultySetting,
  createWordDictionaryFromLessons,
} from "@src/tools/utils";

/** ========================================================================
 * Words/Lessons Mock Data
 * =========================================================================
 */

const WORD: Word = {
  simplified: "阿姨",
  traditional: "阿姨",
  pinyin: "āyí",
  english: "aunt",
  english_alternate_choices: [""],
};

const LESSON_DATA: Lesson = lessonData.content;

const LESSON_BASE: Lesson = LESSON_DATA;

const MULTIPLE_CHOICE_OPTIONS: Lesson = LESSON_DATA.slice(0, 4);

/**
 * Truncate the mock lessons in the test environment to avoid issues with the
 * QuizScreen randomly selected a word index.
 */
const LESSON =
  process.env.NODE_ENV === "test" ? LESSON_BASE.slice(0, 1) : LESSON_BASE;

const LESSONS: ReadonlyArray<HSKList> = HSK_LISTS;

const WORD_DICTIONARY = createWordDictionaryFromLessons(LESSONS);

/** ========================================================================
 * User Score Status
 * =========================================================================
 */

const DEFAULT_LESSON_SCORES = {
  mc_english: false,
  mc_mandarin: false,
  quiz_text: false,
  mandarin_pronunciation: false,
};

const DEFAULT_SCORE_STATE = {
  list_02_score: {
    complete: false,
    list_index: 0,
    list_key: "1-2",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_03_score: {
    complete: false,
    list_index: 1,
    list_key: "3",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_04_score: {
    complete: false,
    list_index: 2,
    list_key: "4",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_05_score: {
    complete: false,
    list_index: 3,
    list_key: "5",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_06_score: {
    complete: false,
    list_index: 4,
    list_key: "6",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_07_score: {
    complete: false,
    list_index: 5,
    list_key: "7",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_08_score: {
    complete: false,
    list_index: 6,
    list_key: "8",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_09_score: {
    complete: false,
    list_index: 7,
    list_key: "9",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  list_10_score: {
    complete: false,
    list_index: 8,
    list_key: "10",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
};

const COMPLETED_SCORE_STATE = {
  list_02_score: {
    complete: true,
    list_index: 0,
    list_key: "1-2",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_03_score: {
    complete: true,
    list_index: 1,
    list_key: "3",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_04_score: {
    complete: true,
    list_index: 2,
    list_key: "4",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_05_score: {
    complete: true,
    list_index: 3,
    list_key: "5",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_06_score: {
    complete: true,
    list_index: 4,
    list_key: "6",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_07_score: {
    complete: true,
    list_index: 5,
    list_key: "7",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_08_score: {
    complete: true,
    list_index: 6,
    list_key: "8",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_09_score: {
    complete: true,
    list_index: 7,
    list_key: "9",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  list_10_score: {
    complete: true,
    list_index: 8,
    list_key: "10",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
};

const getMockScoreStatus = (overrides: Partial<ListScoreSet>) => ({
  ...DEFAULT_SCORE_STATE,
  ...overrides,
});

/** ========================================================================
 * Global State
 * =========================================================================
 */

const EXPERIENCE_POINTS = 54234;

const SETTINGS: UserSettings = {
  disable_audio: false,
  auto_proceed_question: false,
  language_setting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  app_difficulty_setting: APP_DIFFICULTY_SETTING.EASY,
};

const USER: User = {
  uuid: uuid(),
  settings: SETTINGS,
  score_history: DEFAULT_SCORE_STATE,
  experience_points: EXPERIENCE_POINTS,
};

export const getNewDefaultUser = () => ({
  uuid: uuid(),
  email: "",
  username: "",
  push_token: "",
  score_history: DEFAULT_SCORE_STATE,
  experience_points: 0,
  settings: SETTINGS,
});

const GLOBAL_STATE_PROPS: GlobalStateContextProps = {
  ...GlobalStateContextValues,
  experience: EXPERIENCE_POINTS,
  updateAvailable: false,
  user: USER,
  lessons: LESSONS,
  wordDictionary: WORD_DICTIONARY,
  userScoreStatus: DEFAULT_SCORE_STATE,
  languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
};

/** ========================================================================
 * Sound Recording State
 * =========================================================================
 */

const SOUND_RECORDING_PROPS: SoundRecordingProps = {
  playbackError: false,
  loadingSoundData: false,
  audioMetadataCache: {},
  prefetchLessonSoundData: async (lesson: Lesson) => {
    return;
  },
  handlePronounceWord: async (traditionalCharacters: string) => {
    return;
  },
};

/** ========================================================================
 * Navigation Params
 * =========================================================================
 */

const lists = adjustListContentByDifficultySetting(
  LESSON,
  APP_DIFFICULTY_SETTING.EASY,
);

const LIST_SCREEN_PARAMS: ListScreenParams = {
  listKey: "1-2",
  hskList: lists,
  listIndex: 0,
  type: "LESSON",
};

const LESSON_SCREEN_PARAMS: LessonScreenParams = {
  lesson: LESSON.slice(0, 10),
  listIndex: 0,
  lessonIndex: 0,
  isFinalLesson: false,
  type: "LESSON",
  isFinalUnlockedLesson: false,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

const MOCKS = {
  USER,
  WORD,
  LESSONS,
  LESSON_DATA,
  MULTIPLE_CHOICE_OPTIONS,
  WORD_DICTIONARY,
  DEFAULT_LESSON_SCORES,
  COMPLETED_SCORE_STATE,
  DEFAULT_SCORE_STATE,
  GLOBAL_STATE_PROPS,
  SOUND_RECORDING_PROPS,
  LIST_SCREEN_PARAMS,
  LESSON_SCREEN_PARAMS,
  getMockScoreStatus,
};

export default MOCKS;
