import {
  GOOGLE_TRANSLATE_API_KEY,
  PINYIN_CONVERSION_SERVICE_API_KEY,
  PINYIN_CONVERSION_SERVICE_URL,
  SENDGRID_API_KEY,
} from "../../env";

/** ========================================================================
 * Environment variables config.
 * =========================================================================
 */

const CONFIG = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || SENDGRID_API_KEY,
  PINYIN_CONVERSION_SERVICE_URL:
    process.env.PINYIN_CONVERSION_SERVICE_URL || PINYIN_CONVERSION_SERVICE_URL,
  PINYIN_CONVERSION_SERVICE_API_KEY:
    process.env.PINYIN_CONVERSION_SERVICE_API_KEY ||
    PINYIN_CONVERSION_SERVICE_API_KEY,
  GOOGLE_TRANSLATE_API_KEY:
    process.env.GOOGLE_TRANSLATE_API_KEY || GOOGLE_TRANSLATE_API_KEY,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default CONFIG;
