import axios from "axios";

import { APP_DIFFICULTY_SETTING, ScoreStatus } from "@src/GlobalState";
import CONFIG from "@src/tools/config";
import {
  HSKListSet,
  Result,
  ResultType,
  SoundFileResponse,
} from "@src/tools/types";

/** ========================================================================
 * Types & Config
 * =========================================================================
 */

export interface UserResponseData {
  uuid: string;
  email: string;
  experience_points: number;
  score_history: string;
  app_difficulty_setting: APP_DIFFICULTY_SETTING;
}

type UserResponse = Promise<UserResponseData | undefined>;

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/** ========================================================================
 * API Methods
 * =========================================================================
 */

/**
 * Find or create a user given their email.
 */
export const findOrCreateUser = async (email: string): UserResponse => {
  try {
    const maybeUser = {
      email,
      experience_points: 0,
      score_history: {},
    };

    const response = await fetch(`${CONFIG.DRAGON_URI}/users`, {
      method: "POST",
      body: JSON.stringify(maybeUser),
      headers: HEADERS,
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.log("Error fetching user: ", err);
    return;
  }
};

/**
 * Update score status for a user.
 */
export const updateUserScores = async (
  userId: string,
  userScores: ScoreStatus,
): UserResponse => {
  try {
    const response = await fetch(`${CONFIG.DRAGON_URI}/set-scores/${userId}`, {
      method: "POST",
      body: JSON.stringify(userScores),
      headers: HEADERS,
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
    return;
  }
};

/**
 * Update experience points for a user.
 */
export const updateUserExperience = async (
  userId: string,
  userExperience: number,
): UserResponse => {
  try {
    const response = await fetch(`${CONFIG.DRAGON_URI}/experience/${userId}`, {
      method: "POST",
      body: JSON.stringify({
        experience_points: String(userExperience),
      }),
      headers: HEADERS,
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
    return;
  }
};

/**
 * Update app difficulty setting for user.
 */
export const updateAppDifficultySetting = async (
  userId: string,
  appDifficultySetting: APP_DIFFICULTY_SETTING,
): UserResponse => {
  try {
    const result = await axios.post<UserResponseData>(
      `${CONFIG.DRAGON_URI}/difficulty/${userId}`,
      { app_difficulty_setting: appDifficultySetting },
    );
    return result.data;
  } catch (err) {
    console.log(err);
    return;
  }
};

/**
 * Fetch lesson content.
 */
export const fetchLessonSet = async (): Promise<HSKListSet | null> => {
  const URL = `${CONFIG.DRAGON_URI}/lessons`;
  try {
    const result = await axios.get<HSKListSet>(URL);
    return result.data;
  } catch (err) {
    console.log(`Failed to fetch lessons at url: ${URL}`);
    return null;
  }
};

const getForvoUrl = (word: string) => {
  const encodedWordURI = encodeURIComponent(word);
  const url = `https://apifree.forvo.com/key/${
    CONFIG.FORVO_API_KEY
  }/format/json/action/word-pronunciations/word/${encodedWordURI}/language/zh`;

  return url;
};

/**
 * Fetch word pronunciation.
 */
export const fetchWordPronunciation = async (
  word: string,
): Promise<Result<SoundFileResponse>> => {
  try {
    const url = getForvoUrl(word);
    const result = await axios.get<SoundFileResponse>(url);
    return {
      type: ResultType.OK,
      data: result.data,
    };
  } catch (err) {
    console.log("Error fetching sound pronunciation file ---", err.message);
    return {
      err,
      type: ResultType.ERROR,
    };
  }
};
