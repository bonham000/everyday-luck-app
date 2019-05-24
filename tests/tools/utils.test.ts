import { ROUTE_NAMES } from "@src/constants/RouteNames";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
} from "@src/providers/GlobalStateContext";
import {
  capitalize,
  convertAppDifficultyToLessonSize,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
  getAudioFileUrl,
  getListScoreKeyFromIndex,
  isLessonComplete,
  mapWordsForList,
  resetNavigation,
} from "@src/tools/utils";
import { DEFAULT_SCORE_STATE, MOCK_WORD } from "@tests/data";

describe("utils", () => {
  test("resetNavigation", () => {
    const result = resetNavigation(ROUTE_NAMES.HOME);
    expect(result).toMatchSnapshot();
  });

  test("mapWordsForList", () => {
    const result = mapWordsForList(MOCK_WORD);
    expect(result).toMatchSnapshot();
  });

  test("getListScoreKeyFromIndex", () => {
    const results: ReadonlyArray<any> = [
      getListScoreKeyFromIndex(0),
      getListScoreKeyFromIndex(1),
      getListScoreKeyFromIndex(2),
      getListScoreKeyFromIndex(3),
      getListScoreKeyFromIndex(4),
    ];

    for (const result of results) {
      expect(result).toMatchSnapshot();
    }
  });

  test("isLessonComplete", () => {
    expect(isLessonComplete(DEFAULT_SCORE_STATE)).toBeFalsy();

    expect({
      mc_english: true,
      mc_mandarin: true,
      quiz_text: true,
      mandarin_pronunciation: true,
    }).toBeTruthy();
  });

  test("formatUserLanguageSetting", () => {
    expect(
      formatUserLanguageSetting(APP_LANGUAGE_SETTING.SIMPLIFIED),
    ).toMatchInlineSnapshot(`"Simplified Chinese"`);
    expect(
      formatUserLanguageSetting(APP_LANGUAGE_SETTING.TRADITIONAL),
    ).toMatchInlineSnapshot(`"Traditional Chinese"`);
  });

  test("getAlternateLanguageSetting", () => {
    expect(getAlternateLanguageSetting(APP_LANGUAGE_SETTING.TRADITIONAL)).toBe(
      APP_LANGUAGE_SETTING.SIMPLIFIED,
    );
    expect(getAlternateLanguageSetting(APP_LANGUAGE_SETTING.SIMPLIFIED)).toBe(
      APP_LANGUAGE_SETTING.TRADITIONAL,
    );
  });

  test("getAudioFileUrl", () => {
    const formatUrlResult = (url: string) => url.slice(url.indexOf("static"));
    let result = getAudioFileUrl("我-1");
    expect(formatUrlResult(result)).toMatchInlineSnapshot(
      `"static/%E6%88%91-1.mp3"`,
    );

    result = getAudioFileUrl("蛋糕-5");
    expect(formatUrlResult(result)).toMatchInlineSnapshot(
      `"static/%E8%9B%8B%E7%B3%95-5.mp3"`,
    );

    result = getAudioFileUrl("對不起-3");
    expect(formatUrlResult(result)).toMatchInlineSnapshot(
      `"static/%E5%B0%8D%E4%B8%8D%E8%B5%B7-3.mp3"`,
    );
  });

  test("convertAppDifficultyToLessonSize", () => {
    expect(
      convertAppDifficultyToLessonSize(APP_DIFFICULTY_SETTING.EASY),
    ).toMatchInlineSnapshot(`10`);
    expect(
      convertAppDifficultyToLessonSize(APP_DIFFICULTY_SETTING.MEDIUM),
    ).toMatchInlineSnapshot(`20`);
    expect(
      convertAppDifficultyToLessonSize(APP_DIFFICULTY_SETTING.HARD),
    ).toMatchInlineSnapshot(`30`);
  });

  test("capitalize", () => {
    expect(capitalize("hello hello hello")).toBe("Hello hello hello");
    expect(capitalize("Hello HELLO HELLO")).toBe("Hello hello hello");
    expect(capitalize("HELLO hello hello")).toBe("Hello hello hello");
    expect(capitalize("hELLO hello hello")).toBe("Hello hello hello");
  });
});
