import Lesson_02 from "@src/lessons/02_HSK_1-2";
import Lesson_03 from "@src/lessons/03_HSK_3";
import Lesson_04 from "@src/lessons/04_HSK_4";
import Lesson_05 from "@src/lessons/05_HSK_5";
import Lesson_06 from "@src/lessons/06_HSK_6";
import Lesson_07 from "@src/lessons/07_General_Vocabulary";
import Lesson_08 from "@src/lessons/08_Contemporary_Chinese_1-7";
import Lesson_09 from "@src/lessons/09_Contemporary_Chinese_7";
import Lesson_10 from "@src/lessons/10_Contemporary_Chinese_8";
import Lesson_11 from "@src/lessons/11_Contemporary_Chinese_9";
import Lesson_12 from "@src/lessons/12_Far_East_1-6";
import Lesson_13 from "@src/lessons/13_Contemporary_Chinese_10";
import Lesson_14 from "@src/lessons/14_Far_East_7-8";
import Lesson_15 from "@src/lessons/15_Sentences_Example";

import { ContentList, HSKListSet } from "@src/tools/types";

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
  quiz_text_reverse: boolean;
  mandarin_pronunciation: boolean;
}

/**
 * Generate new ids here:
 *
 * https://npm.runkit.com/shortid
 * console.log(shortid.generate());
 */
export type ListScoreSet = { [key: string]: ListScore };

/** ========================================================================
 * Combine and export all HSK List Content
 * =========================================================================
 */

const filterEmptyWords = (lesson: ContentList) => ({
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
  Lesson_14,
  Lesson_15,
].map(filterEmptyWords);

export default HSK_LISTS;
