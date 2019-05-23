import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
} from "@src/providers/GlobalStateContext";
import { GlobalStateContextProps } from "@src/providers/GlobalStateProvider";
import { SoundRecordingProps } from "@src/providers/SoundRecordingProvider";
import { GoogleSigninUser } from "@src/tools/store";
import {
  HSKList,
  Lesson,
  LessonScreenParams,
  ListScreenParams,
  Word,
} from "@src/tools/types";
import { createWordDictionaryFromLessons } from "@src/tools/utils";
import lessonData from "./tools/lessonData";

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

export const WORD_SET: ReadonlyArray<Word> = [
  {
    simplified: "啊",
    traditional: "啊",
    pinyin: "a",
    english: "ah",
    english_alternate_choices: [""],
  },
  {
    simplified: "矮",
    traditional: "矮",
    pinyin: "ǎi",
    english: "short",
    english_alternate_choices: [""],
  },
  {
    simplified: "爱好",
    traditional: "愛好",
    pinyin: "àihào",
    english: "hobby",
    english_alternate_choices: [""],
  },
  {
    simplified: "安静",
    traditional: "安靜",
    pinyin: "ānjìng",
    english: "Be quiet",
    english_alternate_choices: [""],
  },
  {
    simplified: "把",
    traditional: "把",
    pinyin: "bǎ",
    english: "hold",
    english_alternate_choices: [""],
  },
];

/** ========================================================================
 * User Score Status
 * =========================================================================
 */

export const DEFAULT_SCORE_STATE = {
  mc_english: false,
  mc_mandarin: false,
  quiz_text: false,
  mandarin_pronunciation: false,
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

const GoogleUser = {
  email: "sean.smith.2009@gmail.com",
  familyName: "Smith",
  givenName: "Sean",
  id: "asdf7f98asd7f0s7ads0",
  name: "Seanie X",
};

const MockLessonBase: ReadonlyArray<Word> = lessonData;

export const MockMultipleChoiceOptions = lessonData.slice(0, 4);

/**
 * Truncate the mock lessons in the test environment to avoid issues with the
 * QuizScreen randomly selected a word index.
 */
const MockLesson =
  process.env.NODE_ENV === "test" ? MockLessonBase.slice(0, 1) : MockLessonBase;

const MockLessons: ReadonlyArray<HSKList> = [
  {
    list: "1-2",
    content: MockLesson,
  },
  {
    list: "3",
    content: MockLesson,
  },
];

export const MockGlobalStateProps: GlobalStateContextProps = {
  user: GoogleUser,
  lessons: MockLessons,
  userScoreStatus: DEFAULT_SCORE_STATE,
  experience: 54234,
  wordDictionary: createWordDictionaryFromLessons(MockLessons),
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

export const MockSoundRecordingProps: SoundRecordingProps = {
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

export const MockListScreenParams: ListScreenParams = {
  listKey: "1-2",
  hskList: [MockLesson],
  listIndex: 0,
  type: "LESSON",
};

export const MockLessonScreenParams: LessonScreenParams = {
  lesson: MockLesson,
  listIndex: 0,
  lessonIndex: 0,
  isFinalLesson: false,
  type: "LESSON",
  isFinalUnlockedLesson: false,
};
