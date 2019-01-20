import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";

export interface Word {
  characters: string;
  phonetic: string;
  english: string;
}

export type Lesson = ReadonlyArray<Word>;

export type LessonSet = ReadonlyArray<Lesson>;

export interface PracticeScreenParams {
  lesson: LessonSummaryScreen;
}
