import axios from "axios";

import { ScoreStatus } from "@src/GlobalState";
import CONFIG from "@src/tools/config";
import {
  LessonSet,
  Result,
  ResultType,
  SoundFileResponse,
} from "@src/tools/types";

/** ========================================================================
 * Types & Config
 * =========================================================================
 */

export interface UserResponse {
  uuid: string;
  email: string;
  experience_points: number;
  score_history: string;
}

type Response = Promise<UserResponse | undefined>;

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/** ========================================================================
 * API Helper Methods
 * =========================================================================
 */

/**
 * Find or create a user given their email.
 */
export const findOrCreateUser = async (email: string): Response => {
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
  }

  return;
};

/**
 * Update score status for a user.
 */
export const updateUserScores = async (
  userId: string,
  userScores: ScoreStatus,
): Response => {
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
  }

  return;
};

/**
 * Update experience points for a user.
 */
export const updateUserExperience = async (
  userId: string,
  userExperience: number,
): Response => {
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
  }

  return;
};

/**
 * Fetch lesson content.
 */
export const fetchLessonSet = async (): Promise<LessonSet | null> => {
  try {
    const URL = `${CONFIG.DRAGON_URI}/lessons`;
    const result = await axios.get<LessonSet>(URL);
    return result.data;
  } catch (err) {
    console.log(err);
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
    console.log("Error fetching sound pronunciation file", err);
    return {
      err,
      type: ResultType.ERROR,
    };
  }
};
