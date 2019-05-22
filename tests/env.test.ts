import * as ENV from "../env";

describe("Environment Variables Configuration", () => {
  test("Contains the same keys - if this test fails a key was added. Be sure to update the create_env.sh script!", () => {
    const vars = Object.keys(ENV);
    expect(vars).toMatchInlineSnapshot(`
Array [
  "SENTRY_DSN",
  "SENTRY_AUTH_TOKEN",
  "ANDROID_CLIENT_ID",
  "IOS_CLIENT_ID",
  "FORVO_API_KEY",
  "GOOGLE_TRANSLATE_API_KEY",
  "PINYIN_CONVERSION_SERVICE_API_KEY",
  "STARGAZER_SERVER_URL",
  "DRAGON_URI",
]
`);
  });
});
