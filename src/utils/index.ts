import { NavigationActions, StackActions } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import { Lesson, Word } from "@src/content/types";
import { LanguageSelection, ScoreStatus } from "@src/GlobalContext";

export const assertUnreachable = (x: never): never => {
  throw new Error(`Unreachable code! -> ${JSON.stringify(x)}`);
};

/**
 * Return a random number for the given range.
 */
export const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Shuffle an array of values.
 */
export const knuthShuffle = (array: ReadonlyArray<any>): ReadonlyArray<any> => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    // @ts-ignore
    // tslint:disable-next-line
    array[currentIndex] = array[randomIndex];
    // @ts-ignore
    // tslint:disable-next-line
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
 * Filter function for searching words list and matching based on
 * mandarin, pinyin, or english input.
 */
export const filterBySearchTerm = (searchValue: string) => (word: Word) => {
  const term = searchValue.toLowerCase();
  const { characters, phonetic, english } = word;
  return (
    characters.toLowerCase().includes(term) ||
    phonetic.toLowerCase().includes(term) ||
    english.toLowerCase().includes(term)
  );
};

/**
 * Map words to list items for view all screen.
 */
export const mapWordsForList = (word: Word) => ({
  ...word,
  key: word.characters,
});

/**
 * Reset the navigation stack to the given route name.
 */
export const resetNavigation = (routeName: ROUTE_NAMES) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
};

/**
 * Filter the words list and only return 1 character words.
 */
export const filterForOneCharacterMode = (
  words: ReadonlyArray<Word>,
): ReadonlyArray<Word> => {
  return words.filter(({ characters }) => characters.length === 1);
};

const LESSON_MAX = 25;

/**
 * Combine individual lesson content and check for duplicate words.
 *
 * Big function!
 */
export const deriveContentFromLessons = (
  contentBlocks: ReadonlyArray<ReadonlyArray<Word>>,
  language: LanguageSelection,
) => {
  let summaryMessage = `\nContent Summary for ${language}:\n\n`;
  // Use a set to check for duplicate entries
  const wordSet = new Set();
  const lessons = contentBlocks.reduce((content, lesson, index) => {
    /**
     * Check and validate length of lesson
     */
    if (lesson.length > LESSON_MAX) {
      throw new Error(
        `Invalid length for ${language} lesson ${index +
          1}: expected ${LESSON_MAX} but received ${lesson.length}`,
      );
    } else if (
      lesson.length !== 0 &&
      lesson.length < LESSON_MAX &&
      index < contentBlocks.length - 1
    ) {
      throw new Error(
        `Invalid length for non-final for ${language} lesson ${index +
          1}: expected ${LESSON_MAX} but received ${lesson.length}`,
      );
    } else {
      summaryMessage += `Lesson ${index + 1} - ${lesson.length} ${
        lesson.length < 10 ? " " : ""
      }total words\n`;
    }

    return content.concat(
      ...lesson.map((item: Word) => {
        const { characters } = item;
        if (wordSet.has(characters)) {
          throw new Error(`Duplicate word detected! -> ${characters}`);
        } else {
          wordSet.add(item.characters);
        }

        return {
          ...item,
          lessonKey: index + 1,
        };
      }),
    );
  }, []);

  console.log(summaryMessage);
  return lessons;
};

/**
 * Derive shuffled multiple choice options given a word and all the
 * language content.
 */
export const getAlternateChoices = (word: Word, alternates: Lesson) => {
  // tslint:disable-next-line
  let choices: Word[] = [word];
  let idx: number;
  let option: Word;
  const chosen: Set<number> = new Set();

  while (choices.length < 4) {
    idx = randomInRange(0, alternates.length);
    option = alternates[idx];

    if (
      !chosen.has(idx) &&
      option.characters !== word.characters &&
      option.characters.length <= word.characters.length + 2
    ) {
      chosen.add(idx);
      choices = [...choices, option];
    }
  }

  return knuthShuffle(choices);
};

/**
 * Determines the unlocked lesson for a user given their score status.
 */
export const getFinalUnlockedLesson = (
  userScoreStatus: ScoreStatus,
): number => {
  // @ts-ignore
  return userScoreStatus.reduce((final, current, index) => {
    if (typeof final === "number") {
      return final;
    } else if (!current.mc || !current.q) {
      return index;
    } else {
      return null;
    }
  }, null);
};
