import { AsyncStorage } from "react-native";

import { getLessonSet } from "@src/content/index.ts";
import { ScoreStatus } from "@src/GlobalContext";
import { Lesson } from "./types";

const STORE_KEY = "SCORES";

const LESSON_SET = getLessonSet("Mandarin");

export const getExistingUserScoresAsync = async () => {
  try {
    const result = await AsyncStorage.getItem(STORE_KEY);
    let parsedResult = JSON.parse(result);

    if (!parsedResult) {
      throw new Error("Data uninitialized");
    } else {
      if (parsedResult.length < LESSON_SET.length) {
        parsedResult = parsedResult.concat(
          new Array(LESSON_SET.length - parsedResult.length)
            .fill("")
            .map(fillLesson),
        );
      }
    }

    return parsedResult;
  } catch (err) {
    return initialLessonScoreState;
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
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(initialLessonScoreState));
  } catch (err) {
    return;
  }
};

const fillLesson = (item: Lesson) => ({
  mc: false,
  q: false,
});

export const initialLessonScoreState: ScoreStatus = LESSON_SET.map(fillLesson);
