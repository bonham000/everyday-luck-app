import LESSON_ONE from "@src/content/korean/01.ts";
import LESSON_TWO from "@src/content/korean/02.ts";
import { deriveContentFromLessons } from "@src/tools/utils";

export const LESSONS: ReadonlyArray<any> = [LESSON_ONE, LESSON_TWO];

export default deriveContentFromLessons(LESSONS, "Korean");
