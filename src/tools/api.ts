import axios from "axios";

import HSK_LISTS from "@src/lessons";
import {
  APP_DIFFICULTY_SETTING,
  ScoreStatus,
} from "@src/providers/GlobalStateContext";
import CONFIG from "@src/tools/config";
import {
  GoogleTranslateResponse,
  HSKListSet,
  LANGUAGE_CODE_MAP,
  languageCode,
  Result,
  ResultType,
  SoundFileResponse,
  User,
  UserResponse,
} from "@src/tools/types";

/** ========================================================================
 * API Methods
 * =========================================================================
 */

/**
 * Find or create a user given their email.
 */
export const findOrCreateUser = async (email: string): UserResponse => {
  try {
    const result = await axios.post<User>(`${CONFIG.DRAGON_URI}/users`, {
      email,
    });
    return result.data;
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
    const result = await axios.post<User>(
      `${CONFIG.DRAGON_URI}/set-scores/${userId}`,
      userScores,
    );
    return result.data;
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
    const result = await axios.post<User>(
      `${CONFIG.DRAGON_URI}/experience/${userId}`,
      {
        experience_points: String(userExperience),
      },
    );
    return result.data;
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
    const result = await axios.post<User>(
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
export const fetchLessonSet = (): HSKListSet => {
  return HSK_LISTS;
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

/**
 * Build the Google Translate API url based on the provided user options.
 *
 * @param word word to translate
 * @param languageSetting user languageSetting
 * @param translateEnglishToChinese boolean indicating if source is English
 * @returns url for Google Translate API
 */
const buildGoogleTranslationUrl = (
  word: string,
  source: languageCode,
  target: languageCode,
): string => {
  const encodedWord = encodeURIComponent(word);

  let url = `https://translation.googleapis.com/language/translate/v2?`;

  url += `key=${CONFIG.GOOGLE_TRANSLATE_API_KEY}`;
  url += `&source=${LANGUAGE_CODE_MAP[source]}`;
  url += `&target=${LANGUAGE_CODE_MAP[target]}`;
  url += `&q=${encodedWord}`;

  return url;
};

/**
 * Translate some text using Google Translate API. Translates between Chinese and
 * English, respecting user language setting.
 *
 * @param word word to translate
 * @param languageSetting user languageSetting
 * @param translateEnglishToChinese boolean indicating if source is English
 * @returns `Promise<TranslationsData>` translation result
 */
export const fetchWordTranslation = async (
  word: string,
  source: languageCode,
  target: languageCode,
): Promise<ReadonlyArray<string>> => {
  try {
    const url = buildGoogleTranslationUrl(word, source, target);
    const result = await axios.get<GoogleTranslateResponse>(url);
    const { translations } = result.data.data;
    return translations.map(({ translatedText }) => translatedText);
  } catch (err) {
    return [""];
  }
};

/**
 * Fetch some pinyin for Chinese characters.
 *
 * @param chineseCharacters
 * @returns `Promise<string>` pinyin result
 */
export const convertChineseToPinyin = async (
  chineseCharacters: string,
): Promise<string> => {
  try {
    const base = `https://pinyin-conversion-service-py7hlqkrxa-uc.a.run.app`;
    const token = CONFIG.PINYIN_CONVERSION_SERVICE_API_KEY;
    const inputCharacters = encodeURIComponent(chineseCharacters);
    const url = `${base}/convert?token=${token}&chinese=${inputCharacters}`;
    const result = await axios.get<string>(url);
    return result.data;
  } catch (err) {
    return "";
  }
};
