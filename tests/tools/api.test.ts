import { buildGoogleTranslationUrl, getForvoUrl } from "@src/tools/api";
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
    expect(result).toMatchInlineSnapshot(
      `"https://translation.googleapis.com/language/translate/v2?key=&source=zh-TW&target=zh-CN&q=%E9%98%BF%E5%A7%A8"`,
    );

    result = buildGoogleTranslationUrl(
      MOCKS.WORD.simplified,
      "simplified",
      "english",
    );
    expect(result).toMatchInlineSnapshot(
      `"https://translation.googleapis.com/language/translate/v2?key=&source=zh-CN&target=en&q=%E9%98%BF%E5%A7%A8"`,
    );
  });
});
