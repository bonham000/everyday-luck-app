import {
  buildGoogleTranslationUrl,
  getForvoUrl,
  serializeUser,
} from "@src/tools/api";
import MOCKS from "@tests/mocks";

describe("api utils", () => {
  test("serializeUser", () => {
    const result = serializeUser(MOCKS.USER);
    expect(result).toMatchInlineSnapshot(`
Object {
  "email": "sean.smith.2009@gmail.com",
  "experience_points": 54234,
  "family_name": "Smith",
  "given_name": "Sean",
  "name": "Seanie X",
  "photo_url": "",
  "push_token": "s7d89a69f69a6d76sa80fsa6f0",
  "score_history": "{\\"mc_english\\":false,\\"mc_mandarin\\":false,\\"quiz_text\\":false,\\"mandarin_pronunciation\\":false,\\"list_02_score\\":{\\"complete\\":false,\\"list_index\\":0,\\"list_key\\":\\"1-2\\",\\"number_words_completed\\":0},\\"list_03_score\\":{\\"complete\\":false,\\"list_index\\":1,\\"list_key\\":\\"3\\",\\"number_words_completed\\":0},\\"list_04_score\\":{\\"complete\\":false,\\"list_index\\":2,\\"list_key\\":\\"4\\",\\"number_words_completed\\":0},\\"list_05_score\\":{\\"complete\\":false,\\"list_index\\":3,\\"list_key\\":\\"5\\",\\"number_words_completed\\":0},\\"list_06_score\\":{\\"complete\\":false,\\"list_index\\":4,\\"list_key\\":\\"6\\",\\"number_words_completed\\":0}}",
  "settings": "{\\"disable_audio\\":false,\\"auto_proceed_question\\":false,\\"language_setting\\":\\"simplified\\",\\"app_difficulty_setting\\":\\"EASY\\"}",
  "uuid": "asdf7f98asd7f0s7ads0",
}
`);
  });

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
});
