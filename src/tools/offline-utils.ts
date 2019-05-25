import { ASYNC_STORE_KEYS } from "@src/constants/AsyncStoreKeys";
import {
  APP_DIFFICULTY_SETTING,
  ScoreStatus,
} from "@src/providers/GlobalStateContext";
import {
  updateAppDifficultySetting,
  updateUserExperience,
  updateUserScores,
} from "@src/tools/api";
import { AsyncStorage } from "react-native";
import { assertUnreachable } from "./utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

enum REQUEST_HANDLER_TYPE {
  APP_DIFFICULTY = "APP_DIFFICULTY",
  USER_EXPERIENCE = "USER_EXPERIENCE",
  USER_SCORES = "USER_SCORES",
}

interface UpdateAppDifficultyHandler {
  type: REQUEST_HANDLER_TYPE.APP_DIFFICULTY;
  userId: string;
  appDifficultySetting: APP_DIFFICULTY_SETTING;
}

interface UpdateUserExperienceHandler {
  type: REQUEST_HANDLER_TYPE.USER_EXPERIENCE;
  userId: string;
  updatedExperience: number;
}

interface UpdateUserScoresHandler {
  type: REQUEST_HANDLER_TYPE.USER_SCORES;
  userId: string;
  updatedScoreStatus: ScoreStatus;
}

export type GenericRequestHandler =
  | UpdateAppDifficultyHandler
  | UpdateUserExperienceHandler
  | UpdateUserScoresHandler;

/** ========================================================================
 * Helper Methods
 * =========================================================================
 */

export const createSerializedAppDifficultyHandler = (
  userId: string,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
): UpdateAppDifficultyHandler => {
  return {
    userId,
    appDifficultySetting,
    type: REQUEST_HANDLER_TYPE.APP_DIFFICULTY,
  };
};

export const createSerializedUserExperienceHandler = (
  userId: string,
  updatedExperience: number,
): UpdateUserExperienceHandler => {
  return {
    userId,
    updatedExperience,
    type: REQUEST_HANDLER_TYPE.USER_EXPERIENCE,
  };
};

export const createSerializedUserScoresHandler = (
  userId: string,
  updatedScoreStatus: ScoreStatus,
): UpdateUserScoresHandler => {
  return {
    userId,
    updatedScoreStatus,
    type: REQUEST_HANDLER_TYPE.USER_SCORES,
  };
};

export const deserializeAndRunRequest = async (
  serializedRequest: GenericRequestHandler,
): Promise<any> => {
  console.log("Deserializing and running request...");
  switch (serializedRequest.type) {
    case REQUEST_HANDLER_TYPE.APP_DIFFICULTY:
      return updateAppDifficultySetting(
        serializedRequest.userId,
        serializedRequest.appDifficultySetting,
      );
    case REQUEST_HANDLER_TYPE.USER_EXPERIENCE:
      return updateUserExperience(
        serializedRequest.userId,
        serializedRequest.updatedExperience,
      );
    case REQUEST_HANDLER_TYPE.USER_SCORES:
      return updateUserScores(
        serializedRequest.userId,
        serializedRequest.updatedScoreStatus,
      );
    default:
      return assertUnreachable(serializedRequest);
  }
};

/** ========================================================================
 * Async Storage Helper Methods
 * =========================================================================
 */

export const deserializeRequestQueue = async () => {
  try {
    const result = await AsyncStorage.getItem(
      ASYNC_STORE_KEYS.OFFLINE_REQUEST_QUEUE,
    );
    return JSON.parse(result);
  } catch (err) {
    return;
  }
};

export const serializeRequestQueue = async (
  data: ReadonlyArray<GenericRequestHandler>,
) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.OFFLINE_REQUEST_QUEUE,
      JSON.stringify(data),
    );
  } catch (err) {
    return;
  }
};
