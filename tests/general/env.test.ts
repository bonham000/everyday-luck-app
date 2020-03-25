import * as ENV from "../../env";

describe("Environment Variables Configuration", () => {
  test("Contains the same keys - if this test fails a key was added. Be sure to update the create_env.sh script!", () => {
    const vars = Object.keys(ENV).sort();
    expect(vars).toMatchInlineSnapshot(`
      Array [
        "AMPLITUDE_API_KEY",
        "GOOGLE_TRANSLATE_API_KEY",
        "PINYIN_CONVERSION_SERVICE_API_KEY",
        "PINYIN_CONVERSION_SERVICE_URL",
        "SENDGRID_API_KEY",
        "SENTRY_AUTH_TOKEN",
        "SENTRY_DSN",
      ]
    `);
  });
});
