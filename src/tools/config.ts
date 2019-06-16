import {
  AMAZON_CLOUD_FRONT,
  AMPLITUDE_API_KEY,
  DRAGON_URI,
  FORVO_API_KEY,
  GOOGLE_TRANSLATE_API_KEY,
  PINYIN_CONVERSION_SERVICE_API_KEY,
  PINYIN_CONVERSION_SERVICE_URL,
  SENDGRID_API_KEY,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
  STARGAZER_SERVER_URL,
} from "../../env";

/** ========================================================================
 * Environment variables config.
 * =========================================================================
 */

const CONFIG = {
  DRAGON_URI: process.env.DRAGON_URI || DRAGON_URI,
  AMAZON_CLOUD_FRONT: process.env.AMAZON_CLOUD_FRONT || AMAZON_CLOUD_FRONT,
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY || AMPLITUDE_API_KEY,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || SENTRY_AUTH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN || SENTRY_DSN,
  FORVO_API_KEY: process.env.FORVO_API_KEY || FORVO_API_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || SENDGRID_API_KEY,
  PINYIN_CONVERSION_SERVICE_URL:
    process.env.PINYIN_CONVERSION_SERVICE_URL || PINYIN_CONVERSION_SERVICE_URL,
  PINYIN_CONVERSION_SERVICE_API_KEY:
    process.env.PINYIN_CONVERSION_SERVICE_API_KEY ||
    PINYIN_CONVERSION_SERVICE_API_KEY,
  GOOGLE_TRANSLATE_API_KEY:
    process.env.GOOGLE_TRANSLATE_API_KEY || GOOGLE_TRANSLATE_API_KEY,
  STARGAZER_SERVER_URL:
    process.env.STARGAZER_SERVER_URL || STARGAZER_SERVER_URL,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default CONFIG;
