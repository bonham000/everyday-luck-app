import {
  buildGoogleTranslationUrl,
  getForvoUrl,
  getSendGridEmailData,
} from "@src/tools/api";
import MOCKS from "@tests/mocks";

describe("api utils", () => {
  test("getForvoUrl", async () => {
    expect(
      getForvoUrl(MOCKS.WORD.simplified).includes(
        "format/json/action/word-pronunciations/word/%E9%98%BF%E5%A7%A8/language/zh",
      ),
    ).toBeTruthy();
    expect(
      getForvoUrl(MOCKS.WORD.traditional).includes(
        "format/json/action/word-pronunciations/word/%E9%98%BF%E5%A7%A8/language/zh",
      ),
    ).toBeTruthy();
  });

  test("buildGoogleTranslationUrl", async () => {
    let result = buildGoogleTranslationUrl(
      MOCKS.WORD.traditional,
      "traditional",
      "simplified",
    );
    expect(
      result.includes("source=zh-TW&target=zh-CN&q=%E9%98%BF%E5%A7%A8"),
    ).toBeTruthy();

    result = buildGoogleTranslationUrl(
      MOCKS.WORD.simplified,
      "simplified",
      "english",
    );
    expect(
      result.includes("source=zh-CN&target=en&q=%E9%98%BF%E5%A7%A8"),
    ).toBeTruthy();
  });

  test("getSendGridEmailData", () => {
    const result = getSendGridEmailData("sean.smith.2009@gmail.com", "hello!");
    expect(result).toMatchInlineSnapshot(`
      Object {
        "content": Array [
          Object {
            "type": "text/plain",
            "value": "hello!",
          },
        ],
        "from": Object {
          "email": "sean.smith.2009@gmail.com",
        },
        "personalizations": Array [
          Object {
            "subject": "天天吉 - personal suggestions and feedback",
            "to": Array [
              Object {
                "email": "sean.smith.2009@gmail.com",
              },
            ],
          },
        ],
      }
    `);
  });
});
