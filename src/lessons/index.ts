import Lesson_02 from "@src/lessons/02";
import Lesson_03 from "@src/lessons/03";
import Lesson_04 from "@src/lessons/04";
import Lesson_05 from "@src/lessons/05";
import Lesson_06 from "@src/lessons/06";
import { HSKListSet } from "@src/tools/types";

/** ========================================================================
 * Combine and export all HSK List Content
 * =========================================================================
 */

const HSK_LISTS: HSKListSet = [
  Lesson_02,
  Lesson_03,
  Lesson_04,
  Lesson_05,
  Lesson_06,
];

export default HSK_LISTS;
