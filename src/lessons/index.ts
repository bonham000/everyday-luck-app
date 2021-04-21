import HSK_1_2 from "@src/lessons/HSK_1-2";
import HSK_3 from "@src/lessons/HSK_3";
import HSK_4 from "@src/lessons/HSK_4";
import HSK_5 from "@src/lessons/HSK_5";
import HSK_6 from "@src/lessons/HSK_6";
import General_Vocabulary_Frequency_List from "@src/lessons/General_Vocabulary_Frequency_List";
import GeneralVocabulary from "@src/lessons/General_Vocabulary";
import GeneralVocabularyFruits from "@src/lessons/General_Vocabulary_Fruit";
import Contemporary_Chinese_1_6 from "@src/lessons/Contemporary_Chinese_1_6";
import Contemporary_Chinese_7_15 from "@src/lessons/Contemporary_Chinese_7_15";
import Far_East_1_8 from "@src/lessons/Far_East_1_8";
import Far_East_9 from "@src/lessons/Far_East_9";
import Grammar_Lesson_6_15 from "@src/lessons/Grammar_Lesson_6_15";
import Grammar_Custom from "@src/lessons/Grammar_Custom";

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

const setListIndexes = (lesson: ContentList, index: number) => ({
  ...lesson,
  list: index === 0 ? lesson.list : String(index + 1),
});

const LISTS: HSKListSet = [
  HSK_1_2,
  HSK_3,
  HSK_4,
  HSK_5,
  HSK_6,
  General_Vocabulary_Frequency_List,
  GeneralVocabulary,
  GeneralVocabularyFruits,
  Contemporary_Chinese_1_6,
  Contemporary_Chinese_7_15,
  Far_East_1_8,
  Far_East_9,
  Grammar_Custom,
  Grammar_Lesson_6_15,
]
  .map(filterEmptyWords)
  .map(setListIndexes);

export default LISTS;
