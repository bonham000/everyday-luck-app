import {
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
} from "../../env";

/**
 * Provide config for environment variables.
 *
 * Use env.ts file for local development.
 */

const CONFIG = {
  ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID || ANDROID_CLIENT_ID,
  IOS_CLIENT_ID: process.env.IOS_CLIENT_ID || IOS_CLIENT_ID,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || SENTRY_AUTH_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN || SENTRY_DSN,
};

export default CONFIG;
