import { AsyncStorage } from "react-native";

import { Lesson, LessonSet } from "@src/content/types";
import { ScoreStatus } from "@src/GlobalState";
import CONFIG from "@src/tools/config";

/** ========================================================================
 * User Authentication
 * =========================================================================
 */

const USER_KEY = "USER_KEY";

export interface User {
  email?: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photoUrl?: string;
}

export const getUser = async () => {
  try {
    const result = await AsyncStorage.getItem(USER_KEY);
    return JSON.parse(result);
  } catch (err) {
    return;
  }
};

export const saveUser = async (user: User) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    return;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (err) {
    return;
  }
};

/** ========================================================================
 * Quiz
 * =========================================================================
 */

const STORE_KEY = "SCORES";
const EXPERIENCE_KEY = "EXPERIENCE";

// const LESSON_SET = getLessonSet("Mandarin");

export const fetchLessonSet = async (): Promise<LessonSet | null> => {
  try {
    const URL = `${CONFIG.DRAGON_URI}/lessons`;
    const response = await fetch(URL);
    const result: LessonSet = await response.json();

    return result;
  } catch (err) {
    return null;
  }
};

export const getExistingUserScoresAsync = async (lessonSet: LessonSet) => {
  try {
    const result = await AsyncStorage.getItem(STORE_KEY);
    let parsedResult = JSON.parse(result);

    if (!parsedResult) {
      throw new Error("Data uninitialized");
    } else {
      if (parsedResult.length < lessonSet.length) {
        parsedResult = parsedResult.concat(
          new Array(lessonSet.length - parsedResult.length)
            .fill("")
            .map(fillLesson),
        );
      }
    }

    return parsedResult;
  } catch (err) {
    return getInitialScoreState(lessonSet);
  }
};

export const saveProgressToAsyncStorage = async (
  userScoreStatus: ScoreStatus,
) => {
  try {
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(userScoreStatus));
  } catch (err) {
    return;
  }
};

export const resetUserScoresAsync = async () => {
  try {
    const lessons = await fetchLessonSet();
    if (lessons) {
      const initialScoreState = getInitialScoreState(lessons);
      AsyncStorage.setItem(STORE_KEY, JSON.stringify(initialScoreState));
    }
  } catch (err) {
    return;
  }
};

export const getUserExperience = async (): Promise<number> => {
  try {
    const result = await AsyncStorage.getItem(EXPERIENCE_KEY);
    const parsedResult = JSON.parse(result);
    return parsedResult || 0;
  } catch (err) {
    return 0;
  }
};

export const addExperiencePoints = async (
  exp: number,
): Promise<number | undefined> => {
  try {
    const existingExp = await getUserExperience();
    const newExp = existingExp + exp;
    await AsyncStorage.setItem(EXPERIENCE_KEY, JSON.stringify(newExp));
    return newExp;
  } catch (err) {
    return;
  }
};

const fillLesson = (_: Lesson) => ({
  mc: false,
  q: false,
});

const getInitialScoreState = (lessons: LessonSet) => lessons.map(fillLesson);
