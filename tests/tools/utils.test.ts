import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { APP_LANGUAGE_SETTING } from "@src/providers/GlobalStateContext";
import {
  formatUserLanguageSetting,
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
});
