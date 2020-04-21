import Lesson_02 from "@src/lessons/02";
import Lesson_03 from "@src/lessons/03";
import Lesson_04 from "@src/lessons/04";
import Lesson_05 from "@src/lessons/05";
import Lesson_06 from "@src/lessons/06";
import Lesson_07 from "@src/lessons/07";
import Lesson_08 from "@src/lessons/08";
import Lesson_09 from "@src/lessons/09";
import Lesson_10 from "@src/lessons/10";
import Lesson_11 from "@src/lessons/11";
import Lesson_12 from "@src/lessons/12";
import Lesson_13 from "@src/lessons/13";

import { HSKList, HSKListSet } from "@src/tools/types";

/** ===========================================================================
 * Types & Config
 * ----------------------------------------------------------------------------
 * Adding a new vocabulary set requires importing it here and adding the
 * additional lesson in the definitions below.
 * ============================================================================
 */

export interface ListScore {
  list_key: string;
  list_index: number;
  complete: boolean;
  number_words_completed: number;
  mc_english: boolean;
  mc_mandarin: boolean;
  quiz_text: boolean;
  mandarin_pronunciation: boolean;
}

/**
 * Generate new ids here:
 *
 * https://npm.runkit.com/shortid
 * console.log(shortid.generate());
 */
export interface ListScoreSet {
  hmcs97kF5: ListScore;
  m1uti3kcG: ListScore;
  aZuy5YQTO5: ListScore;
  f6OodXOVM1: ListScore;
  yXMqj8ait2: ListScore;
  wLnPWgrVUY: ListScore;
  CbbMYmOGz: ListScore;
  qaAR6U7k8Q: ListScore;
  wALlo9yXLq: ListScore;
  xyB2jhUO3: ListScore;
  hjbUpJC1UF: ListScore;
  jhEP7WEWFF: ListScore;
  MgKHTvgnv: ListScore;
}

/**
 * Index mapping of score keys to list index.
 */
export const SCORES_INDEX_MAP: ReadonlyArray<keyof ListScoreSet> = [
  "hmcs97kF5",
  "m1uti3kcG",
  "aZuy5YQTO5",
  "f6OodXOVM1",
  "yXMqj8ait2",
  "wLnPWgrVUY",
  "CbbMYmOGz",
  "qaAR6U7k8Q",
  "wALlo9yXLq",
  "xyB2jhUO3",
  "hjbUpJC1UF",
  "jhEP7WEWFF",
  "MgKHTvgnv",
];

/** ========================================================================
 * Combine and export all HSK List Content
 * =========================================================================
 */

const filterEmptyWords = (lesson: HSKList) => ({
  ...lesson,
  content: lesson.content.filter(word => Boolean(word.traditional)),
});

const HSK_LISTS: HSKListSet = [
  Lesson_02,
  Lesson_03,
  Lesson_04,
  Lesson_05,
  Lesson_06,
  Lesson_07,
  Lesson_08,
  Lesson_09,
  Lesson_10,
  Lesson_11,
  Lesson_12,
  Lesson_13,
].map(filterEmptyWords);

export default HSK_LISTS;
