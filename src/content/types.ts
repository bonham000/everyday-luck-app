export interface Word {
  characters: string;
  phonetic: string;
  english: string;
}

export type LessonSet = ReadonlyArray<ReadonlyArray<Word>>;
