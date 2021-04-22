import uuid from "uuid/v1";

import HSK_LISTS, { ListScoreSet } from "@src/lessons";
import lessonData from "@src/lessons/HSK_1-2";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  GlobalStateContextValues,
  UserSettings,
} from "@src/providers/GlobalStateContext";
import { GlobalStateContextProps } from "@src/providers/GlobalStateProvider";
import { SoundRecordingProps } from "@src/providers/SoundRecordingProvider";
import {
  ContentList,
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

export const CUSTOM_WORD_LIST_TITLE = "Custom Word List 🎨";
export const BOOKMARKED_WORD_LIST_TITLE = "Bookmarked Word List 🔖";

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

const LESSONS: ContentList[] = HSK_LISTS;

const WORD_DICTIONARY = createWordDictionaryFromLessons(LESSONS);

/** ========================================================================
 * User Score Status
 * =========================================================================
 */

const DEFAULT_LESSON_SCORES = {
  mc_english: false,
  mc_mandarin: false,
  quiz_text: false,
  quiz_text_reverse: false,
  mandarin_pronunciation: false,
};

const getLessonFiller = (complete = false) =>
  HSK_LISTS.slice(1).reduce((map, contentList, index) => {
    return {
      ...map,
      [contentList.id]: {
        id: contentList.id,
        type: contentList.type,
        complete: false,
        list_index: index + 1,
        list_key: index + 3,
        number_words_completed: complete ? 10000 : 0,
        ...DEFAULT_LESSON_SCORES,
      },
    };
  }, {});

const DEFAULT_SCORE_STATE = {
  // @ts-ignore
  hmcs97kF5: {
    id: "hmcs97kF5",
    type: "HSK",
    complete: false,
    list_index: 0,
    list_key: "1-2",
    number_words_completed: 0,
    ...DEFAULT_LESSON_SCORES,
  },
  ...(getLessonFiller() as ListScoreSet),
};

const COMPLETED_SCORE_STATE = {
  // @ts-ignore
  hmcs97kF5: {
    complete: true,
    list_index: 0,
    list_key: "1-2",
    number_words_completed: 10000,
    ...DEFAULT_LESSON_SCORES,
  },
  ...(getLessonFiller(true) as ListScoreSet),
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
  quizCacheSet: {},
  app_theme: "light",
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
  experience_points: 0,
  settings: SETTINGS,
  score_history: DEFAULT_SCORE_STATE,
});

const GLOBAL_STATE_PROPS: GlobalStateContextProps = {
  ...GlobalStateContextValues,
  appTheme: "light",
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
  id: "afa87sd0f97sa0",
  contentType: "HSK",
  listKey: "1-2",
  hskList: lists,
  listIndex: 0,
  type: "LESSON",
};

const LESSON_SCREEN_PARAMS: LessonScreenParams = {
  id: "afa87sd0f97sa0",
  contentType: "HSK",
  listKey: "1-2",
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
