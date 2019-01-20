export interface Word {
  characters: string;
  phonetic: string;
  english: string;
}

export type Lesson = ReadonlyArray<Word>;

export type LessonSet = ReadonlyArray<Lesson>;

export interface LessonScreenParams {
  lesson: Lesson;
  lessonIndex: number;
  isSummaryReview?: boolean;
  headerTitle?: string;
}
