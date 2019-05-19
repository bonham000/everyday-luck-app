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
 * Global App Types
 * =========================================================================
 */

export interface Word {
  traditional: string;
  simplified: string;
  pinyin: string;
  english: string;
  english_alternate_choices: ReadonlyArray<string>;
}

export interface HSKList {
  list: string;
  content: Lesson;
}

export type Lesson = ReadonlyArray<Word>;
export type HSKListSet = ReadonlyArray<HSKList>;

export type LessonSummaryType = "SUMMARY" | "GAME" | "LESSON";

export interface LessonScreenParams {
  lesson: HSKList;
  lessonIndex: number;
  headerTitle?: string;
  type: LessonSummaryType;
}

/** ========================================================================
 * API Types
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
