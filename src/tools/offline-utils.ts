import { AsyncStorage } from "react-native";

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
import { UserAsyncResponse } from "@src/tools/types";
import { assertUnreachable } from "@src/tools/utils";

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

export type RequestQueue = ReadonlyArray<GenericRequestHandler>;

/** ========================================================================
 * Helper Methods
 * =========================================================================
 */

/**
 * Create the serialized handler for updating user app difficulty setting.
 *
 * @param userId
 * @param appDifficultySetting
 * @returns `UpdateAppDifficultyHandler`
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

/**
 * Create the serialized handler for updating user score status.
 *
 * @param userId
 * @param updatedExperience
 * @returns `UpdateUserExperienceHandler`
 */
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

/**
 * Create the serialized handler for updating user score status.
 *
 * @param userId
 * @param updatedScoreStatus
 * @returns `UpdateUserScoresHandler`
 */
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

/**
 * Deserialize and execute a request from the request queue.
 *
 * @param serializeRequest request data
 * @returns `UserResponse` data
 */
export const deserializeAndRunRequest = async (
  serializedRequest: GenericRequestHandler,
): UserAsyncResponse => {
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

/**
 * Deserialize saved request queue if it exists.
 *
 * @returns `RequestQueue`
 */
export const deserializeRequestQueue = async (): Promise<RequestQueue> => {
  try {
    const result = await AsyncStorage.getItem(
      ASYNC_STORE_KEYS.OFFLINE_REQUEST_QUEUE,
    );
    const queue = JSON.parse(result);
    return queue || [];
  } catch (err) {
    return [];
  }
};

/**
 * Serialize the request queue and save to local AsyncStorage module.
 *
 * @param `RequestQueue`
 */
export const serializeRequestQueue = async (data: RequestQueue) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.OFFLINE_REQUEST_QUEUE,
      JSON.stringify(data),
    );
  } catch (err) {
    return;
  }
};
