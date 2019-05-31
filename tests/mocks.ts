import HSK_LISTS from "@src/lessons";
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
import { createWordDictionaryFromLessons } from "@src/tools/utils";

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

const EXPERIENCE_POINTS = 54234;

const SETTINGS: UserSettings = {
  disable_audio: false,
  auto_proceed_question: false,
  language_setting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  app_difficulty_setting: APP_DIFFICULTY_SETTING.EASY,
};

const USER: User = {
  email: "sean.smith.2009@gmail.com",
  family_name: "Smith",
  given_name: "Sean",
  uuid: "asdf7f98asd7f0s7ads0",
  name: "Seanie X",
  photo_url: "",
  score_history: DEFAULT_SCORE_STATE,
  experience_points: EXPERIENCE_POINTS,
  settings: SETTINGS,
};

const GLOBAL_STATE_PROPS: GlobalStateContextProps = {
  ...GlobalStateContextValues,
  experience: EXPERIENCE_POINTS,
  networkConnected: true,
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

const LIST_SCREEN_PARAMS: ListScreenParams = {
  listKey: "1-2",
  hskList: [LESSON],
  listIndex: 0,
  type: "LESSON",
};

const LESSON_SCREEN_PARAMS: LessonScreenParams = {
  lesson: LESSON,
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
  LESSON_DATA,
  MULTIPLE_CHOICE_OPTIONS,
  WORD_DICTIONARY,
  DEFAULT_LESSON_SCORES,
  DEFAULT_SCORE_STATE,
  GLOBAL_STATE_PROPS,
  SOUND_RECORDING_PROPS,
  LIST_SCREEN_PARAMS,
  LESSON_SCREEN_PARAMS,
};

export default MOCKS;
