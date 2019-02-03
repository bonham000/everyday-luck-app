import LESSON_ONE from "@src/content/mandarin/01.ts";
import LESSON_TWO from "@src/content/mandarin/02.ts";
import LESSON_THREE from "@src/content/mandarin/03.ts";
import LESSON_FOUR from "@src/content/mandarin/04.ts";
import LESSON_FIVE from "@src/content/mandarin/05.ts";
import LESSON_SIX from "@src/content/mandarin/06.ts";
import LESSON_SEVEN from "@src/content/mandarin/07.ts";
import LESSON_EIGHT from "@src/content/mandarin/08.ts";
import LESSON_NINE from "@src/content/mandarin/09.ts";
import LESSON_TEN from "@src/content/mandarin/10.ts";
import LESSON_ELEVEN from "@src/content/mandarin/11.ts";

import { LessonSet } from "@src/content/types";
import { deriveContentFromLessons, isLessonEmpty } from "@src/tools/utils";

export const LESSONS: LessonSet = [
  LESSON_ONE,
  LESSON_TWO,
  LESSON_THREE,
  LESSON_FOUR,
  LESSON_FIVE,
  LESSON_SIX,
  LESSON_SEVEN,
  LESSON_EIGHT,
  LESSON_NINE,
  LESSON_TEN,
  LESSON_ELEVEN,
].filter(isLessonEmpty);

export default deriveContentFromLessons(LESSONS, "Mandarin");
