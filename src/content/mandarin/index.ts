import LESSON_ONE from "@src/content/mandarin/01.ts";
import LESSON_TWO from "@src/content/mandarin/02.ts";
import LESSON_THREE from "@src/content/mandarin/03.ts";
import LESSON_FOUR from "@src/content/mandarin/04.ts";
import LESSON_FIVE from "@src/content/mandarin/05.ts";
import { LessonSet } from "@src/content/types";
import { deriveContentFromLessons } from "@src/utils";

export const LESSONS: LessonSet = [
  LESSON_ONE,
  LESSON_TWO,
  LESSON_THREE,
  LESSON_FOUR,
  LESSON_FIVE,
];

export default deriveContentFromLessons(LESSONS, "Mandarin");
