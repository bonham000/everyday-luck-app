import { NavigationActions, StackActions } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import { Lesson, Word } from "@src/content/types";

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

/**
 * Combine individual lesson content and check for duplicate words
 */
export const deriveContentFromLessons = (
  contentBlocks: ReadonlyArray<ReadonlyArray<Word>>,
) => {
  // Use a set to check for duplicate entries
  const wordSet = new Set();
  return contentBlocks.reduce((content, lesson, index) => {
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
};

/**
 * Derive shuffled multiple choice options given a word and all the
 * language content.
 */
export const getAlternateChoices = (word: string, alternates: Lesson) => {
  // tslint:disable-next-line
  let choices: string[] = [word];
  let idx: number;
  let option: string;

  while (choices.length < 4) {
    idx = randomInRange(0, alternates.length);
    option = alternates[idx].characters;

    if (option !== word && option.length <= word.length + 2) {
      choices = [...choices, option];
    }
  }

  return knuthShuffle(choices);
};
