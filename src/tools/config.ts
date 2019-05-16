import {
  ANDROID_CLIENT_ID,
  DRAGON_URI,
  IOS_CLIENT_ID,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
} from "../../env";

/** ========================================================================
 * Environment variables config.
 * =========================================================================
 */

const CONFIG = {
  DRAGON_URI: process.env.DRAGON_URI || DRAGON_URI,
  ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID || ANDROID_CLIENT_ID,
  IOS_CLIENT_ID: process.env.IOS_CLIENT_ID || IOS_CLIENT_ID,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || SENTRY_AUTH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN || SENTRY_DSN,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default CONFIG;
