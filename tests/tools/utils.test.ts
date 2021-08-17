import HSK_LISTS from "@src/lessons";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  QUIZ_TYPE,
} from "@src/providers/GlobalStateContext";
import { Lesson } from "@src/tools/types";
import {
  calculateExperiencePointsForLesson,
  capitalize,
  convertAppDifficultyToLessonSize,
  createWordDictionaryFromLessons,
  determineAnyPossibleCorrectAnswerForFreeInput,
  determineFinalUnlockedLessonInList,
  fetchLessonSet,
  filterBySearchTerm,
  flattenLessonSet,
  formatUserLanguageSetting,
  getAlternateChoices,
  getAlternateLanguageSetting,
  getFinalUnlockedListKey,
  getLessonSummaryStatus,
  getQuizSuccessToasts,
  getRandomQuizChallenge,
  getReviewLessonSet,
  hasUserCompletedAllLists,
  isEmailValid,
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
    for (const lesson of HSK_LISTS.slice(0, 5)) {
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
        seen.add(`${choice.traditional}-${choice.pinyin}`);
      }
      expect(seen.size).toBe(choices.length);
    };

    const alternates = flattenLessonSet(HSK_LISTS.slice(0, 5));

    const quizTypes: ReadonlyArray<QUIZ_TYPE> = [
      QUIZ_TYPE.ENGLISH,
      QUIZ_TYPE.MANDARIN,
      QUIZ_TYPE.PRONUNCIATION,
    ];

    for (const lesson of HSK_LISTS.slice(0, 5)) {
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

  test("mapWordsForList", () => {
    const result = mapWordsForList(MOCKS.WORD);
    expect(result).toMatchSnapshot();
  });

  test("isLessonComplete", () => {
    expect(isLessonComplete(MOCKS.DEFAULT_SCORE_STATE.hmcs97kF5)).toBeFalsy();

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

  test("isNetworkConnected", () => {
    expect(isNetworkConnected("none")).toBeFalsy();
    expect(isNetworkConnected("cell")).toBeTruthy();
    expect(isNetworkConnected("wifi")).toBeTruthy();
    expect(isNetworkConnected("WIFI")).toBeTruthy();
  });

  test("createWordDictionaryFromLessons", () => {
    const result = createWordDictionaryFromLessons(MOCKS.LESSONS);
    const words = flattenLessonSet(MOCKS.LESSONS);
    for (const word of words) {
      expect(word.simplified in result).toBeTruthy();
      expect(word.traditional in result).toBeTruthy();
      expect(word.english.toLowerCase() in result).toBeTruthy();
    }
  });

  test("determineFinalUnlockedLesson", () => {
    let result = determineFinalUnlockedLessonInList(
      MOCKS.LESSON_DATA,
      "hmcs97kF5",
      MOCKS.DEFAULT_SCORE_STATE,
      APP_DIFFICULTY_SETTING.EASY,
    );
    expect(result).toBe(0);

    result = determineFinalUnlockedLessonInList(
      MOCKS.LESSON_DATA,
      "hmcs97kF5",
      MOCKS.getMockScoreStatus({
        hmcs97kF5: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 80,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
      }),
      APP_DIFFICULTY_SETTING.EASY,
    );
    expect(result).toBe(8);

    result = determineFinalUnlockedLessonInList(
      MOCKS.LESSON_DATA,
      "hmcs97kF5",
      MOCKS.getMockScoreStatus({
        hmcs97kF5: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 80,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
      }),
      APP_DIFFICULTY_SETTING.MEDIUM,
    );
    expect(result).toBe(4);
  });

  test("filterBySearchTerm", () => {
    const word = MOCKS.WORD;

    let testFn = filterBySearchTerm("阿");
    expect(testFn(word)).toBeTruthy();

    testFn = filterBySearchTerm("晚安");
    expect(testFn(word)).toBeFalsy();

    testFn = filterBySearchTerm("姨");
    expect(testFn(word)).toBeTruthy();

    testFn = filterBySearchTerm("aunt");
    expect(testFn(word)).toBeTruthy();

    testFn = filterBySearchTerm("āyí");
    expect(testFn(word)).toBeTruthy();

    testFn = filterBySearchTerm("world");
    expect(testFn(word)).toBeFalsy();
  });

  test("getFinalUnlockedListKey", () => {
    let result = getFinalUnlockedListKey(MOCKS.DEFAULT_SCORE_STATE);
    expect(result).toBe(0);

    result = getFinalUnlockedListKey(
      MOCKS.getMockScoreStatus({
        hmcs97kF5: {
          complete: true,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 80,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
        m1uti3kcG: {
          complete: true,
          list_index: 0,
          list_key: "3",
          number_words_completed: 80,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
      }),
    );
    expect(result).toBe(2);
  });

  test("fetchLessonSet", () => {
    expect(fetchLessonSet()).toEqual(HSK_LISTS);
  });

  test("determineAnyPossibleCorrectAnswerForFreeInput", () => {
    const correct = {
      simplified: "富",
      traditional: "富",
      pinyin: "fù",
      english: "Rich",
      english_alternate_choices: [""],
    };

    const provided = {
      simplified: "丰富",
      traditional: "豐富",
      pinyin: "fēngfù",
      english: "Rich, plentiful, abundant",
      english_alternate_choices: [""],
    };

    let result = determineAnyPossibleCorrectAnswerForFreeInput(
      provided.simplified,
      correct,
      APP_LANGUAGE_SETTING.SIMPLIFIED,
      MOCKS.WORD_DICTIONARY,
    );

    expect(result).toMatchInlineSnapshot(`
      Object {
        "correct": true,
        "correctWord": Object {
          "english": "Rich",
          "pinyin": "fēng fù",
          "simplified": "丰富",
          "traditional": "豐富",
        },
      }
    `);

    result = determineAnyPossibleCorrectAnswerForFreeInput(
      "晚安",
      correct,
      APP_LANGUAGE_SETTING.SIMPLIFIED,
      MOCKS.WORD_DICTIONARY,
    );

    expect(result).toMatchInlineSnapshot(`
      Object {
        "correct": false,
        "correctWord": Object {
          "english": "Rich",
          "english_alternate_choices": Array [
            "",
          ],
          "pinyin": "fù",
          "simplified": "富",
          "traditional": "富",
        },
      }
    `);
  });

  test("getRandomQuizChallenge", () => {
    const { result } = getRandomQuizChallenge({
      listId: "hmcs97kF5",
      quizCacheSet: {},
      lists: MOCKS.LESSONS,
      unlockedListIndex: 0,
      appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
      userScoreStatus: MOCKS.getMockScoreStatus({
        hmcs97kF5: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 120,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
      }),
      limitToCurrentList: true,
    });
    expect(result.length).toBe(
      convertAppDifficultyToLessonSize(APP_DIFFICULTY_SETTING.MEDIUM),
    );
  });

  test("getReviewLessonSet", () => {
    let result = getReviewLessonSet({
      quizCacheSet: {},
      listId: "hmcs97kF5",
      lists: MOCKS.LESSONS,
      unlockedListIndex: 0,
      userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
      appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
      limitToCurrentList: false,
    });

    expect(result.length).toBeGreaterThan(10);

    result = getReviewLessonSet({
      quizCacheSet: {},
      listId: "hmcs97kF5",
      lists: MOCKS.LESSONS,
      unlockedListIndex: 2,
      userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
      appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
      limitToCurrentList: false,
    });

    expect(result.length).toBeGreaterThan(610);

    result = getReviewLessonSet({
      quizCacheSet: {},
      listId: "hmcs97kF5",
      lists: MOCKS.LESSONS,
      unlockedListIndex: 4,
      userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
      appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
      limitToCurrentList: false,
    });

    expect(result.length).toBeGreaterThan(2510);
  });

  test("getLessonSummaryStatus", () => {
    let result = getLessonSummaryStatus(
      false,
      MOCKS.DEFAULT_SCORE_STATE,
      "hmcs97kF5",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "mandarinPronunciation": true,
        "mcEnglish": true,
        "mcMandarin": true,
        "quizText": true,
        "quizTextReverse": true,
      }
    `);

    result = getLessonSummaryStatus(
      true,
      MOCKS.DEFAULT_SCORE_STATE,
      "hmcs97kF5",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "mandarinPronunciation": false,
        "mcEnglish": false,
        "mcMandarin": false,
        "quizText": false,
        "quizTextReverse": false,
      }
    `);

    result = getLessonSummaryStatus(
      true,
      MOCKS.DEFAULT_SCORE_STATE,
      "m1uti3kcG",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "mandarinPronunciation": false,
        "mcEnglish": false,
        "mcMandarin": false,
        "quizText": false,
        "quizTextReverse": false,
      }
    `);

    result = getLessonSummaryStatus(
      true,
      MOCKS.getMockScoreStatus({
        hmcs97kF5: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 120,
          mc_english: true,
          mc_mandarin: true,
          quiz_text: false,
          quiz_text_reverse: false,
          mandarin_pronunciation: true,
        },
      }),
      "m1uti3kcG",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "mandarinPronunciation": false,
        "mcEnglish": false,
        "mcMandarin": false,
        "quizText": false,
        "quizTextReverse": false,
      }
    `);
  });

  test("getQuizSuccessToasts", () => {
    let result = getQuizSuccessToasts(true, true, "LESSON", 158, true, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "The next lesson is unlocked! 🥇",
        "secondary": "Great - keep going! 很好! You earned 158 oranges 🍊!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "LESSON", 158, true, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "Amazing! You passed this lesson! 💯",
        "secondary": "Congratulations! You gained 158 🍊 oranges!",
      }
    `);

    result = getQuizSuccessToasts(true, false, "LESSON", 158, true, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "The next lesson is unlocked! 🥇",
        "secondary": "Great - keep going! 很好! You earned 158 oranges 🍊!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "LESSON", 158, true, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "Amazing! You passed this lesson! 💯",
        "secondary": "Congratulations! You gained 158 🍊 oranges!",
      }
    `);

    result = getQuizSuccessToasts(false, false, "SUMMARY", 158, true, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "You finished the quiz!",
        "secondary": "All words completed, 很好！ Try again to get a perfect score to unlock the next lesson.",
      }
    `);

    result = getQuizSuccessToasts(
      false,
      true,
      "OPT_OUT_CHALLENGE",
      158,
      false,
      false,
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "You passed but not with a perfect score!",
        "secondary": "You can try again anytime to still unlock the HSK Level, good luck!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "DAILY_QUIZ", 158, true, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "非常好！ 👏👏👏",
        "secondary": "You gained 158 🍊 oranges! Keep reviewing to master more vocabulary!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "DAILY_QUIZ", 158, true, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "Extraordinary!!! 🏆",
        "secondary": "You've completed all the content! You must be fluent by now! Congratulations!!!",
      }
    `);
  });

  test("calculateExperiencePointsForLesson", () => {
    let result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.QUIZ_TEXT,
      "LESSON",
    );
    expect(result <= 3).toBeTruthy();
    expect(result >= 1).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.MANDARIN,
      "DAILY_QUIZ",
    );

    expect(result <= 2).toBeTruthy();
    expect(result >= 1).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.MANDARIN,
      "OPT_OUT_CHALLENGE",
    );

    expect(result <= 10).toBeTruthy();
    expect(result >= 1).toBeTruthy();
  });

  test("allContentComplete", () => {
    let result = hasUserCompletedAllLists(MOCKS.DEFAULT_SCORE_STATE);
    expect(result).toBeFalsy();

    result = hasUserCompletedAllLists(
      MOCKS.getMockScoreStatus({
        hmcs97kF5: {
          complete: true,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 0,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
        m1uti3kcG: {
          complete: true,
          list_index: 1,
          list_key: "3",
          number_words_completed: 0,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
        aZuy5YQTO5: {
          complete: true,
          list_index: 2,
          list_key: "4",
          number_words_completed: 0,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
        f6OodXOVM1: {
          complete: true,
          list_index: 3,
          list_key: "5",
          number_words_completed: 0,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
        yXMqj8ait2: {
          complete: true,
          list_index: 4,
          list_key: "6",
          number_words_completed: 0,
          ...MOCKS.DEFAULT_LESSON_SCORES,
        },
      }),
    );
    expect(result).toBeTruthy();
  });

  test("isEmailValid", () => {
    let result = isEmailValid("sean.smith.2009@gmail.com");
    expect(result).toBeTruthy();

    result = isEmailValid("asdfasfsafas");
    expect(result).toBeFalsy();

    result = isEmailValid("asdfsa@mail");
    expect(result).toBeFalsy();

    result = isEmailValid("mail.com");
    expect(result).toBeFalsy();
  });
});
