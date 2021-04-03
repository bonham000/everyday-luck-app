import { GestureResponderEvent } from "react-native";

import { ListScoreSet } from "@src/lessons";
import {
  APP_LANGUAGE_SETTING,
  QUIZ_TYPE,
  UserSettings,
  WordDictionary,
} from "@src/providers/GlobalStateContext";
import { APP_THEME } from "@src/providers/GlobalStateProvider";

/** ========================================================================
 * Result & Option Types
 * =========================================================================
 */

export enum ResultType {
  OK = "OK",
  ERROR = "ERROR",
}

export interface ResultSuccess<T> {
  data: T;
  type: ResultType.OK;
}

export interface Error {
  err: Error;
  message?: string;
  type: ResultType.ERROR;
}

export type Result<T> = ResultSuccess<T> | Error;

export enum OptionType {
  OK = "OK",
  EMPTY = "EMPTY",
}

export interface OptionSuccess<T> {
  data: T;
  type: OptionType.OK;
}

export interface Empty {
  message?: string;
  type: OptionType.EMPTY;
}

export type Option<T> = OptionSuccess<T> | Empty;

/** ========================================================================
 * User Types
 * =========================================================================
 */

export interface UserData {
  uuid: string;
}

export interface BaseUser {
  uuid: string;
  experience_points: number;
}

export interface UserJson extends BaseUser {
  settings: string;
  score_history: string;
}

export interface User extends BaseUser {
  score_history: ListScoreSet;
  settings: UserSettings;
}

export type UserAsyncResponse = Promise<UserJson | undefined>;

/** ========================================================================
 * Global App Types
 * =========================================================================
 */

export interface Word {
  traditional: string;
  simplified: string;
  pinyin: string;
  english: string;
  english_alternate_choices?: ReadonlyArray<string>;
}

type ContentListType =
  | "HSK"
  | "Contemporary Chinese"
  | "Far East"
  | "General Vocabulary"
  | "Custom Word List"
  | "Special";

export interface ContentList {
  id: string;
  list: string;
  locked: boolean;
  title?: string;
  content: Lesson;
  dictation?: Lesson;
  type: ContentListType;
}

export type Lesson = Word[];
export type LessonSet = Lesson[];
export type HSKListSet = ContentList[];

export type LessonSummaryType =
  | "SUMMARY"
  | "DAILY_QUIZ"
  | "LESSON"
  | "SHUFFLE_QUIZ"
  | "OPT_OUT_CHALLENGE";

export interface ListScreenParams {
  id: string;
  contentType: ContentListType;
  listKey: string;
  hskList: LessonSet;
  listIndex: number;
  listTitle?: string;
  dictation?: Lesson;
  headerTitle?: string;
  type: LessonSummaryType;
}

export interface LessonScreenParams {
  id: string;
  contentType: ContentListType;
  lesson: Lesson;
  listIndex: number;
  lessonIndex: number;
  listTitle?: string;
  headerTitle?: string;
  isFinalLesson: boolean;
  type: LessonSummaryType;
  dictation?: Lesson;
  isFinalUnlockedLesson: boolean;
}

export interface QuizScreenComponentProps {
  theme: APP_THEME;
  valid: boolean;
  revealAnswer: boolean;
  didReveal: boolean;
  currentWord: Word;
  shouldShake: boolean;
  attempted: boolean;
  value: string;
  lesson: Lesson;
  quizType: QUIZ_TYPE;
  audioDisabled: boolean;
  autoProceedQuestion: boolean;
  wordDictionary: WordDictionary;
  languageSetting: APP_LANGUAGE_SETTING;
  handleProceed: () => void;
  setInputRef: (ref: any) => void;
  handleChange: (value: string) => void;
  handleCheck: (correct: boolean) => void;
  handleCopyToClipboard: (text: string) => void;
  handleToggleRevealAnswer: (event: GestureResponderEvent) => void;
}

/** ========================================================================
 * Google Translate API
 * =========================================================================
 */

export type languageCode = "english" | "traditional" | "simplified";
export const ENGLISH: languageCode = "english";
export const TRADITIONAL_CHINESE: languageCode = "traditional";
export const SIMPLIFIED_CHINESE: languageCode = "simplified";

export const LANGUAGE_CODE_MAP = {
  [ENGLISH]: "en",
  [TRADITIONAL_CHINESE]: "zh-TW",
  [SIMPLIFIED_CHINESE]: "zh-CN",
};

interface Translation {
  translatedText: string;
}

export interface GoogleTranslateResponse {
  data: {
    translations: ReadonlyArray<Translation>;
  };
}

export interface TranslationsData {
  english: string;
  traditional: string;
  simplified: string;
  pinyin: string;
}
