export interface Word {
  traditional: string;
  simplified: string;
  pinyin: string;
  english: string;
  usage_notes: string;
  part_of_speech: string;
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
