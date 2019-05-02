#!/bin/bash

# Create an empty placeholder env file
echo "
const SENTRY_DSN = \"\";
const SENTRY_AUTH_TOKEN = \"\";
const ANDROID_CLIENT_ID = \"\";
const IOS_CLIENT_ID = \"\";
const DRAGON_URI = \"\";

export {
  SENTRY_DSN,
  SENTRY_AUTH_TOKEN,
  ANDROID_CLIENT_ID,
  IOS_CLIENT_ID,
  DRAGON_URI,
 };" > env.ts