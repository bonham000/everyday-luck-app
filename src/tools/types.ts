import { GestureResponderEvent } from "react-native";

import { ListScoreSet } from "@src/lessons";
import {
  APP_LANGUAGE_SETTING,
  QUIZ_TYPE,
  UserSettings,
  WordDictionary,
} from "@src/providers/GlobalStateContext";

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

export interface HSKList {
  list: string;
  locked: boolean;
  title?: string;
  content: Lesson;
}

export type Lesson = ReadonlyArray<Word>;
export type LessonSet = ReadonlyArray<Lesson>;
export type HSKListSet = ReadonlyArray<HSKList>;

export type LessonSummaryType =
  | "SUMMARY"
  | "DAILY_QUIZ"
  | "LESSON"
  | "OPT_OUT_CHALLENGE";

export interface ListScreenParams {
  listKey: string;
  hskList: LessonSet;
  listIndex: number;
  headerTitle?: string;
  type: LessonSummaryType;
}

export interface LessonScreenParams {
  lesson: Lesson;
  listIndex: number;
  lessonIndex: number;
  headerTitle?: string;
  isFinalLesson: boolean;
  type: LessonSummaryType;
  isFinalUnlockedLesson: boolean;
}

export interface QuizScreenComponentProps {
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
 * API Types
 * =========================================================================
 */

/** ========================================================================
 * Forvo API
 * =========================================================================
 */

export interface AudioItem {
  addtime: string;
  code: string;
  country: string;
  hits: number;
  id: number;
  langname: string;
  num_positive_votes: number;
  num_votes: number;
  original: string;
  pathmp3?: string;
  pathogg?: string;
  filePath?: string;
  rate: number;
  sex: string;
  username: string;
  word: string;
}

export interface SoundFileResponse {
  attributes: {
    total: number;
  };
  items: ReadonlyArray<AudioItem>;
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
