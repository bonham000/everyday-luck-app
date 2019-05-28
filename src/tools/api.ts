import axios from "axios";

import CONFIG from "@src/tools/config";
import {
  GoogleTranslateResponse,
  LANGUAGE_CODE_MAP,
  languageCode,
  Result,
  ResultType,
  SoundFileResponse,
  User,
  UserAsyncResponse,
  UserDataBase,
  UserJson,
} from "@src/tools/types";

/** ========================================================================
 * User API Methods
 * =========================================================================
 */

/**
 * Find or create a user given their email.
 */
export const findOrCreateUser = async (
  user: UserDataBase,
): UserAsyncResponse => {
  try {
    const result = await axios.post<UserJson>(
      `${CONFIG.DRAGON_URI}/users`,
      user,
    );
    return result.data;
  } catch (err) {
    console.log("Error fetching user: ", err);
    return;
  }
};

/**
 * Update the user.
 *
 * @param user `User` data to update
 * @returns `UserJson` updated user data
 */
export const updateUser = async (user: User): UserAsyncResponse => {
  try {
    const result = await axios.put<UserJson>(`${CONFIG.DRAGON_URI}/user`, user);
    return result.data;
  } catch (err) {
    console.log("Error from PUT to update user", err);
    throw err;
  }
};

/** ========================================================================
 * Forvo Pronunciation API Methods:
 * =========================================================================
 */

export const getForvoUrl = (word: string) => {
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

/** ========================================================================
 * Language Translation API Methods:
 * =========================================================================
 */

/**
 * Build the Google Translate API url based on the provided user options.
 *
 * @param word word to translate
 * @param languageSetting user languageSetting
 * @param translateEnglishToChinese boolean indicating if source is English
 * @returns url for Google Translate API
 */
export const buildGoogleTranslationUrl = (
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
    const base = CONFIG.PINYIN_CONVERSION_SERVICE_URL;
    const token = CONFIG.PINYIN_CONVERSION_SERVICE_API_KEY;
    const inputCharacters = encodeURIComponent(chineseCharacters);
    const conversionServiceUrl = `${base}/convert?token=${token}&chinese=${inputCharacters}`;
    const result = await axios.get<string>(conversionServiceUrl);
    return result.data;
  } catch (err) {
    return "";
  }
};
