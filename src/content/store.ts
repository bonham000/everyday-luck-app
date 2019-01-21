import { AsyncStorage } from "react-native";

import { getLessonSet } from "@src/content/index.ts";
import { ScoreStatus } from "@src/GlobalContext";

const STORE_KEY = "SCORES";

export const getExistingUserScoresAsync = async () => {
  try {
    const result = await AsyncStorage.getItem(STORE_KEY);
    const parsedResult = JSON.parse(result);

    if (!parsedResult) {
      throw new Error("Data uninitialized");
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

export const initialLessonScoreState: ScoreStatus = getLessonSet(
  "Mandarin",
).map(() => ({
  mc: false,
  q: false,
}));
