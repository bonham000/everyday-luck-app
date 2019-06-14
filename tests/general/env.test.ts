import * as ENV from "../../env";

describe("Environment Variables Configuration", () => {
  test("Contains the same keys - if this test fails a key was added. Be sure to update the create_env.sh script!", () => {
    const vars = Object.keys(ENV).sort();
    expect(vars).toMatchInlineSnapshot(`
      Array [
        "AMAZON_CLOUD_FRONT",
        "ANDROID_CLIENT_ID",
        "ANDROID_STANDALONE_CLIENT_ID",
        "DRAGON_URI",
        "FORVO_API_KEY",
        "GOOGLE_TRANSLATE_API_KEY",
        "GOOGLE_WEB_API_KEY",
        "IOS_CLIENT_ID",
        "PINYIN_CONVERSION_SERVICE_API_KEY",
        "PINYIN_CONVERSION_SERVICE_URL",
        "SENTRY_AUTH_TOKEN",
        "SENTRY_DSN",
        "STARGAZER_SERVER_URL",
      ]
    `);
  });
});
