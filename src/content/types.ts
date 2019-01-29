export interface Word {
  characters: string;
  phonetic: string;
  english: string;
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
