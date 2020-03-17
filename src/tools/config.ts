import {
  AMPLITUDE_API_KEY,
  GOOGLE_TRANSLATE_API_KEY,
  PINYIN_CONVERSION_SERVICE_API_KEY,
  PINYIN_CONVERSION_SERVICE_URL,
  SENDGRID_API_KEY,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
} from "../../env";

/** ========================================================================
 * Environment variables config.
 * =========================================================================
 */

const CONFIG = {
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY || AMPLITUDE_API_KEY,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || SENTRY_AUTH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN || SENTRY_DSN,
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
