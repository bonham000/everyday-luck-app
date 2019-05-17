export interface Word {
  traditional: string;
  simplified: string;
  pinyin: string;
  english: string;
  english_alternate_choices: ReadonlyArray<string>;
}

export type Lesson = ReadonlyArray<Word>;

export type LessonSet = ReadonlyArray<Lesson>;

export type LessonSummaryType = "SUMMARY" | "GAME" | "LESSON";

export interface LessonScreenParams {
  lesson: Lesson;
  lessonIndex: number;
  headerTitle?: string;
  type: LessonSummaryType;
}

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
  message: string;
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
  type: OptionType.EMPTY;
}

export type Option<T> = OptionSuccess<T> | Empty;
