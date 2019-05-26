import HSK_LISTS from "@src/lessons";
import lessonData from "@src/lessons/02";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
} from "@src/providers/GlobalStateContext";
import { GlobalStateContextProps } from "@src/providers/GlobalStateProvider";
import { SoundRecordingProps } from "@src/providers/SoundRecordingProvider";
import {
  GoogleSigninUser,
  HSKList,
  Lesson,
  LessonScreenParams,
  ListScreenParams,
  UserData,
  Word,
} from "@src/tools/types";
import { createWordDictionaryFromLessons } from "@src/tools/utils";

/** ========================================================================
 * Words/Lessons Mock Data
 * =========================================================================
 */

export const MOCK_WORD: Word = {
  simplified: "阿姨",
  traditional: "阿姨",
  pinyin: "āyí",
  english: "aunt",
  english_alternate_choices: [""],
};

export const MOCK_LESSON_DATA: Lesson = lessonData.content;

const MOCK_LESSON_BASE: Lesson = MOCK_LESSON_DATA;

export const MOCK_MULTIPLE_CHOICE_OPTIONS: Lesson = MOCK_LESSON_DATA.slice(
  0,
  4,
);

/**
 * Truncate the mock lessons in the test environment to avoid issues with the
 * QuizScreen randomly selected a word index.
 */
const MOCK_LESSON =
  process.env.NODE_ENV === "test"
    ? MOCK_LESSON_BASE.slice(0, 1)
    : MOCK_LESSON_BASE;

const MOCK_LESSONS: ReadonlyArray<HSKList> = HSK_LISTS;

/** ========================================================================
 * User Score Status
 * =========================================================================
 */

export const DEFAULT_LESSON_SCORES = {
  mc_english: false,
  mc_mandarin: false,
  quiz_text: false,
  mandarin_pronunciation: false,
};

export const DEFAULT_SCORE_STATE = {
  ...DEFAULT_LESSON_SCORES,
  list_02_score: {
    complete: false,
    list_index: 0,
    list_key: "1-2",
    number_words_completed: 0,
  },
  list_03_score: {
    complete: false,
    list_index: 1,
    list_key: "3",
    number_words_completed: 0,
  },
  list_04_score: {
    complete: false,
    list_index: 2,
    list_key: "4",
    number_words_completed: 0,
  },
  list_05_score: {
    complete: false,
    list_index: 3,
    list_key: "5",
    number_words_completed: 0,
  },
  list_06_score: {
    complete: false,
    list_index: 4,
    list_key: "6",
    number_words_completed: 0,
  },
};

/** ========================================================================
 * Global State
 * =========================================================================
 */

const MOCK_GOOGLE_USER: UserData = {
  email: "sean.smith.2009@gmail.com",
  family_name: "Smith",
  given_name: "Sean",
  uuid: "asdf7f98asd7f0s7ads0",
  name: "Seanie X",
  photo_url: "",
};

export const MOCK_GLOBAL_STATE_PROPS: GlobalStateContextProps = {
  experience: 54234,
  networkConnected: true,
  updateAvailable: false,
  user: MOCK_GOOGLE_USER,
  lessons: MOCK_LESSONS,
  userScoreStatus: DEFAULT_SCORE_STATE,
  wordDictionary: createWordDictionaryFromLessons(MOCK_LESSONS),
  languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
  setToastMessage: (toastMessage: string) => {
    return;
  },
  openLanguageSelectionMenu: () => {
    return;
  },
  handleResetScores: () => {
    return;
  },
  handleUpdateApp: () => {
    return;
  },
  handleSwitchLanguage: () => {
    return;
  },
  onSignin: async (user: GoogleSigninUser) => {
    return;
  },
  setLessonScore: (updatedScoreStatus: ScoreStatus, exp: number) => {
    return;
  },
  handleUpdateAppDifficultySetting: async (setting: APP_DIFFICULTY_SETTING) => {
    return;
  },
};

/** ========================================================================
 * Sound Recording State
 * =========================================================================
 */

export const MOCK_SOUND_RECORDING_PROPS: SoundRecordingProps = {
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

export const MOCK_LIST_SCREEN_PARAMS: ListScreenParams = {
  listKey: "1-2",
  hskList: [MOCK_LESSON],
  listIndex: 0,
  type: "LESSON",
};

export const MOCK_LESSON_SCREEN_PARAMS: LessonScreenParams = {
  lesson: MOCK_LESSON,
  listIndex: 0,
  lessonIndex: 0,
  isFinalLesson: false,
  type: "LESSON",
  isFinalUnlockedLesson: false,
};
