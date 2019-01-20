import LESSON_ONE from "@src/content/korean/01.ts";
import { deriveContentFromLessons } from "@src/utils";

export const LESSONS: ReadonlyArray<any> = [LESSON_ONE];

export default deriveContentFromLessons(LESSONS);
