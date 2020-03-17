import axios from "axios";

import CONFIG from "@src/tools/config";
import {
  GoogleTranslateResponse,
  LANGUAGE_CODE_MAP,
  languageCode,
} from "@src/tools/types";

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

/**
 * Send a contact email using the SendGrid API.
 *
 * @param email sender email address
 * @param message text to send
 */
export const sendContactRequest = async (email: string, message: string) => {
  try {
    const data = getSendGridEmailData(email, message);
    const url = "https://api.sendgrid.com/v3/mail/send";
    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${CONFIG.SENDGRID_API_KEY}`,
      },
    });
  } catch (err) {
    return;
  }
};

const TARGET_ADDRESS = "sean.smith.2009@gmail.com";
const SUBJECT = "天天吉 - personal suggestions and feedback";

/**
 * Get the email data to send to the SendGrid API.
 *
 * @param email sender email address
 * @param message text to send
 */
export const getSendGridEmailData = (email: string, message: string) => {
  return {
    personalizations: [
      {
        to: [
          {
            email: TARGET_ADDRESS,
          },
        ],
        subject: SUBJECT,
      },
    ],
    from: {
      email,
    },
    content: [
      {
        value: message,
        type: "text/plain",
      },
    ],
  };
};
