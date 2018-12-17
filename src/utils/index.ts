import { NavigationActions, StackActions } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import Korean from "@src/content/Korean";
import Mandarin, { Word } from "@src/content/Mandarin";

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
    array[currentIndex] = array[randomIndex];
    // @ts-ignore
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
  return words.filter(word => word.characters.length === 1);
};

/**
 * Gets the language lesson content for the user selected language.
 */
export const getLanguageContent = (
  language: "Mandarin" | "Korean",
): ReadonlyArray<Word> => {
  switch (language) {
    case "Mandarin":
      return Mandarin;
    case "Korean":
      return Korean;
    default:
      return [];
  }
};
