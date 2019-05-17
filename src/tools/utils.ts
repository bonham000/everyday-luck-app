import {
  DrawerLockMode,
  NavigationActions,
  StackActions,
} from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { LessonScoreType, ScoreStatus } from "@src/GlobalState";
import { Lesson, LessonSet, LessonSummaryType, Word } from "@src/tools/types";

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
  const { traditional, pinyin, english } = word;
  return (
    traditional.toLowerCase().includes(term) ||
    pinyin.toLowerCase().includes(term) ||
    english.toLowerCase().includes(term)
  );
};

/**
 * Map words to list items for view all screen.
 */
export const mapWordsForList = (word: Word) => ({
  ...word,
  key: word.traditional,
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
  return words.filter(({ traditional }) => traditional.length === 1);
};

/**
 * There can be several empty placeholder lesson blocks. Determine the
 * last lesson block which has content (this one can be partially) filled.
 */
const determineFinalLessonBlock = (contentBlocks: LessonSet): number => {
  return contentBlocks.reduce((finalIndex, current, index) => {
    return current.length ? index : finalIndex;
  }, 0);
};

export const isLessonEmpty = (lesson: Lesson) => {
  return Boolean(
    lesson.filter(({ traditional }) => Boolean(traditional)).length,
  );
};

export const filterEmptyWords = (lesson: Lesson) => {
  return lesson.filter((word: Word) => Boolean(word.traditional));
};

const LESSON_MAX = 25;

/**
 * Combine individual lesson content and check for duplicate words.
 *
 * Big function!
 */
export const deriveContentFromLessons = (contentBlocks: LessonSet) => {
  const language = "Mandarin";
  let totalWords = 0;
  let summaryMessage = `\nContent Summary for ${language}:\n\n`;
  // Use a set to check for duplicate entries
  const wordSet = new Set();
  const finalLessonIndex = determineFinalLessonBlock(contentBlocks);

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
      index < finalLessonIndex
    ) {
      throw new Error(
        `Invalid length for non-final for ${language} lesson ${index +
          1}: expected ${LESSON_MAX} but received ${lesson.length}`,
      );
    } else if (index <= finalLessonIndex) {
      totalWords += lesson.length;
      summaryMessage += `Lesson ${index + 1} - ${lesson.length} ${
        lesson.length < 10 ? " " : ""
      }total words\n`;
    }

    return content.concat(
      ...lesson
        .filter(({ traditional }) => Boolean(traditional))
        .map((item: Word) => {
          const { traditional, english } = item;
          if (wordSet.has(traditional)) {
            throw new Error(
              `Duplicate word detected in lesson ${index +
                1}! -> ${traditional} (${english})`,
            );
          } else {
            wordSet.add(item.traditional);
          }

          return {
            ...item,
            lessonKey: index + 1,
          };
        }),
    );
  }, []);

  summaryMessage += `\nTotal: ${totalWords} words`;
  console.log(summaryMessage);
  return lessons;
};

export type MC_TYPE = "MANDARIN" | "ENGLISH";

const wordFillerContent = {
  traditional: "N/A",
  simplified: "N/A",
  pinyin: "N/A",
  usage_notes: "",
  part_of_speech: "",
  english_alternate_choices: [],
};

/**
 * Derive shuffled multiple choice options given a word and all the
 * language content.
 */
export const getAlternateChoices = (
  word: Word,
  alternates: Lesson,
  mcType: MC_TYPE,
) => {
  let idx: number;
  let option: Word;
  const chosen: Set<number> = new Set();
  let choices: ReadonlyArray<Word> = [word];

  while (choices.length < 4) {
    idx = randomInRange(0, alternates.length);
    option = alternates[idx];

    if (mcType === "MANDARIN") {
      if (
        !chosen.has(idx) &&
        option.english !== word.english &&
        option.traditional !== word.traditional &&
        option.traditional.length <= word.traditional.length + 2
      ) {
        chosen.add(idx);
        choices = [...choices, option];
      }
    } else {
      choices = [
        word,
        ...knuthShuffle(word.english_alternate_choices)
          .slice(0, 4)
          .map(choice => ({
            english: choice,
            ...wordFillerContent,
          })),
      ];

      break;
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
  return userScoreStatus.final_completed_lesson_index;
};

export const getExperiencePointsForLesson = (
  quizType: LessonScoreType,
  lessonType: LessonSummaryType,
): number => {
  const MIN = 500;
  const MAX = quizType === "quiz_text" ? 1250 : 750;
  const OFFSET = lessonType === "LESSON" ? 500 : 0;
  return randomInRange(MIN, MAX - OFFSET);
};

const isOnSignInScreen = (navigationState: any): boolean => {
  try {
    if (navigationState.routes[0].routeName === ROUTE_NAMES.SIGNIN) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const LOCKED = "locked-closed";
const UNLOCKED = "unlocked";

export const getDrawerLockedState = (navigation: any): DrawerLockMode => {
  const isOnSignIn = isOnSignInScreen(navigation.state);
  const drawerLockMode = isOnSignIn
    ? LOCKED
    : navigation.state.index > 0
    ? LOCKED
    : UNLOCKED;
  return drawerLockMode;
};

export const getGameModeLessonSet = (
  lessons: LessonSet,
  unlockedLessonIndex: number,
) => {
  return knuthShuffle(
    lessons
      .slice(0, unlockedLessonIndex + 1)
      .reduce((flattened, lesson) => [...flattened, ...lesson]),
  ).slice(0, 25);
};

export const getReviewLessonSet = (
  lessons: LessonSet,
  unlockedLessonIndex: number,
) => {
  return lessons
    .slice(0, unlockedLessonIndex + 1)
    .reduce((flattened, lesson) => flattened.concat(lesson));
};
