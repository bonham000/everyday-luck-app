import HSK_LISTS from "@src/lessons";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ListScoreSet,
  QUIZ_TYPE,
} from "@src/providers/GlobalStateContext";
import { Lesson } from "@src/tools/types";
import {
  capitalize,
  convertAppDifficultyToLessonSize,
  fetchLessonSet,
  flattenLessonSet,
  formatUserLanguageSetting,
  getAlternateChoices,
  getAlternateLanguageSetting,
  getAudioFileUrl,
  getListScoreKeyFromIndex,
  isLessonComplete,
  isNetworkConnected,
  knuthShuffle,
  mapWordsForList,
  randomInRange,
} from "@src/tools/utils";
import MOCKS from "@tests/mocks";

const assertListsContainSameContent = (listA: Lesson, listB: Lesson) => {
  const counts = new Map();

  for (let i = 0; i < listA.length; i++) {
    const A = listA[i];
    const B = listB[i];
    expect(A.simplified !== B.simplified);
    counts.set(A.simplified, (+counts.get(A.simplified) || 0) + 1);
    counts.set(B.simplified, (+counts.get(B.simplified) || 0) + 1);
  }

  for (const count of counts.values()) {
    expect(count).toBe(2);
  }
};

describe("utils", () => {
  test("randomInRange", () => {
    const ranges: ReadonlyArray<ReadonlyArray<number>> = [
      [0, 10],
      [15, 50],
      [100, 200],
      [1000, 20000],
      [-15, 15],
    ];
    for (const range of ranges) {
      const [min, max] = range;
      let count = 0;
      while (count < 1000) {
        const result = randomInRange(min, max);
        expect(result < max).toBeTruthy();
        expect(result >= min).toBeTruthy();
        count++;
      }
    }
  });

  test("knuthShuffle", () => {
    for (const lesson of HSK_LISTS) {
      const words = lesson.content;
      let current = 0;
      while (current < 10) {
        assertListsContainSameContent(words, knuthShuffle(words.slice()));
        current++;
      }
    }
  });

  test("getAlternateChoices", () => {
    const assertChoicesAreAllUnique = (choices: Lesson) => {
      const seen = new Set();
      for (const choice of choices) {
        seen.add(choice.simplified);
      }
      expect(seen.size).toBe(choices.length);
    };

    const alternates = flattenLessonSet(HSK_LISTS);

    const quizTypes: ReadonlyArray<QUIZ_TYPE> = [
      QUIZ_TYPE.ENGLISH,
      QUIZ_TYPE.MANDARIN,
      QUIZ_TYPE.PRONUNCIATION,
    ];

    for (const lesson of HSK_LISTS) {
      const words = lesson.content;
      for (const word of words) {
        const type = quizTypes[randomInRange(0, 3)];
        const result = getAlternateChoices(
          word,
          alternates,
          MOCKS.WORD_DICTIONARY,
          type,
        );
        assertChoicesAreAllUnique(result);
      }
    }
  });

  test("getListScoreKeyFromIndex", () => {
    const expected: ReadonlyArray<keyof ListScoreSet> = [
      "list_02_score",
      "list_03_score",
      "list_04_score",
      "list_05_score",
      "list_06_score",
    ];

    expected.forEach((key, index) => {
      expect(getListScoreKeyFromIndex(index)).toBe(key);
    });
  });

  test("mapWordsForList", () => {
    const result = mapWordsForList(MOCKS.WORD);
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
    expect(isLessonComplete(MOCKS.DEFAULT_SCORE_STATE)).toBeFalsy();

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
    const formatUrlResult = (url: string) =>
      url.slice(url.indexOf("s3.amazonaws.com"));
    let result = getAudioFileUrl("我-1");
    expect(formatUrlResult(result)).toMatchInlineSnapshot(
      `"s3.amazonaws.com/%E6%88%91-1.mp3"`,
    );

    result = getAudioFileUrl("蛋糕-5");
    expect(formatUrlResult(result)).toMatchInlineSnapshot(
      `"s3.amazonaws.com/%E8%9B%8B%E7%B3%95-5.mp3"`,
    );

    result = getAudioFileUrl("對不起-3");
    expect(formatUrlResult(result)).toMatchInlineSnapshot(
      `"s3.amazonaws.com/%E5%B0%8D%E4%B8%8D%E8%B5%B7-3.mp3"`,
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

  test("flattenLessonSet", () => {
    assertListsContainSameContent(
      flattenLessonSet(HSK_LISTS),
      flattenLessonSet(HSK_LISTS),
    );
  });

  test("isNetworkConnected", () => {
    expect(isNetworkConnected("none")).toBeFalsy();
    expect(isNetworkConnected("cell")).toBeTruthy();
    expect(isNetworkConnected("wifi")).toBeTruthy();
    expect(isNetworkConnected("WIFI")).toBeTruthy();
  });

  test.skip("createWordDictionaryFromLessons", () => {
    expect(true).toBeTruthy();
  });

  test.skip("determineFinalUnlockedLesson", () => {
    expect(true).toBeTruthy();
  });

  test.skip("filterBySearchTerm", () => {
    expect(true).toBeTruthy();
  });

  test.skip("formatHskListContent", () => {
    expect(true).toBeTruthy();
  });

  test.skip("getExperiencePointsForLesson", () => {
    expect(true).toBeTruthy();
  });

  test.skip("getFinalUnlockedListKey", () => {
    expect(true).toBeTruthy();
  });

  test.skip("getLessonSummaryStatus", () => {
    expect(true).toBeTruthy();
  });

  test.skip("getRandomQuizChallenge", () => {
    expect(true).toBeTruthy();
  });

  test.skip("getReviewLessonSet", () => {
    expect(true).toBeTruthy();
  });

  test.skip("mapListIndexToListScores", () => {
    expect(true).toBeTruthy();
  });

  test.skip("translateWord", () => {
    expect(true).toBeTruthy();
  });

  test.skip("transformGoogleSignInResultToUserData", () => {
    expect(true).toBeTruthy();
  });

  test.skip("transformUserJson", () => {
    expect(true).toBeTruthy();
  });

  test.skip("getQuizSuccessToasts", () => {
    expect(true).toBeTruthy();
  });

  test("fetchLessonSet", () => {
    expect(fetchLessonSet()).toEqual(HSK_LISTS);
  });

  test.skip("determineAnyPossibleCorrectAnswerForFreeInput", () => {
    expect(true).toBeTruthy();
  });
});
