import Lesson_02 from "@src/lessons/02";
import Lesson_03 from "@src/lessons/03";
import Lesson_04 from "@src/lessons/04";
import Lesson_05 from "@src/lessons/05";
import Lesson_06 from "@src/lessons/06";
import Lesson_07 from "@src/lessons/07";
import Lesson_08 from "@src/lessons/08";

import { HSKListSet } from "@src/tools/types";

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

export interface ListScoreSet {
  list_02_score: ListScore;
  list_03_score: ListScore;
  list_04_score: ListScore;
  list_05_score: ListScore;
  list_06_score: ListScore;
  list_07_score: ListScore;
  list_08_score: ListScore;
}

/**
 * Index mapping of score keys to list index.
 */
export const SCORES_INDEX_MAP: ReadonlyArray<keyof ListScoreSet> = [
  "list_02_score",
  "list_03_score",
  "list_04_score",
  "list_05_score",
  "list_06_score",
  "list_07_score",
  "list_08_score",
];

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
  Lesson_07,
  Lesson_08,
];

export default HSK_LISTS;
