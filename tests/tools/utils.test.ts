import HSK_LISTS from "@src/lessons";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ListScoreSet,
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
  getAudioFileUrl,
  getFinalUnlockedListKey,
  getLessonSummaryStatus,
  getListScoreKeyFromIndex,
  getQuizSuccessToasts,
  getRandomQuizChallenge,
  getReviewLessonSet,
  isLessonComplete,
  isNetworkConnected,
  knuthShuffle,
  mapListIndexToListScores,
  mapWordsForList,
  randomInRange,
  SCORES_INDEX_MAP,
  transformUserJson,
  translateWord,
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
      0,
      MOCKS.DEFAULT_SCORE_STATE,
      APP_DIFFICULTY_SETTING.EASY,
    );
    expect(result).toBe(0);

    result = determineFinalUnlockedLessonInList(
      MOCKS.LESSON_DATA,
      0,
      MOCKS.getMockScoreStatus({
        list_02_score: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 80,
        },
      }),
      APP_DIFFICULTY_SETTING.EASY,
    );
    expect(result).toBe(8);

    result = determineFinalUnlockedLessonInList(
      MOCKS.LESSON_DATA,
      0,
      MOCKS.getMockScoreStatus({
        list_02_score: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 80,
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
        list_02_score: {
          complete: true,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 80,
        },
        list_03_score: {
          complete: true,
          list_index: 0,
          list_key: "3",
          number_words_completed: 80,
        },
      }),
    );
    expect(result).toBe(2);
  });

  test("translateWord", async () => {
    jest.setTimeout(10000);

    let result = await translateWord("cake", "english");
    expect(typeof result.english).toBe("string");
    expect(typeof result.pinyin).toBe("string");
    expect(typeof result.simplified).toBe("string");
    expect(typeof result.traditional).toBe("string");

    result = await translateWord("晚安", "simplified");
    expect(typeof result.english).toBe("string");
    expect(typeof result.pinyin).toBe("string");
    expect(typeof result.simplified).toBe("string");
    expect(typeof result.traditional).toBe("string");
  });

  test("transformUserJson", () => {
    const userJson = {
      experience_points: 54234,
      username: "Seanie X",
      uuid: "asdf7f98asd7f0s7ads0",
      email: "sean.smith.2009@gmail.com",
      push_token: "s7d89a69f69a6d76sa80fsa6f0",
      settings: `{"disable_audio":false,"auto_proceed_question":false,"language_setting":"simplified","app_difficulty_setting":"EASY"}`,
      score_history: `{"mc_english":false,"mc_mandarin":false,"quiz_text":false,"mandarin_pronunciation":false,"list_02_score":{"complete":false,"list_index":0,"list_key":"1-2","number_words_completed":0},"list_03_score":{"complete":false,"list_index":1,"list_key":"3","number_words_completed":0},"list_04_score":{"complete":false,"list_index":2,"list_key":"4","number_words_completed":0},"list_05_score":{"complete":false,"list_index":3,"list_key":"5","number_words_completed":0},"list_06_score":{"complete":false,"list_index":4,"list_key":"6","number_words_completed":0}}`,
    };

    const result = transformUserJson(userJson);
    expect(result).toEqual(MOCKS.USER);
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
                                        "english": "Rich, plentiful, abundant",
                                        "english_alternate_choices": Array [
                                          "",
                                        ],
                                        "pinyin": "fēngfù",
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
    const result = getRandomQuizChallenge({
      lists: MOCKS.LESSONS,
      unlockedListIndex: 0,
      appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
      userScoreStatus: MOCKS.getMockScoreStatus({
        list_02_score: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 120,
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
      lists: MOCKS.LESSONS,
      unlockedListIndex: 0,
      userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
      appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
      limitToCurrentList: false,
    });

    expect(result.length).toBe(10);

    result = getReviewLessonSet({
      lists: MOCKS.LESSONS,
      unlockedListIndex: 2,
      userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
      appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
      limitToCurrentList: false,
    });

    expect(result.length).toBe(610);

    result = getReviewLessonSet({
      lists: MOCKS.LESSONS,
      unlockedListIndex: 4,
      userScoreStatus: MOCKS.DEFAULT_SCORE_STATE,
      appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
      limitToCurrentList: false,
    });

    expect(result.length).toBe(2510);
  });

  test("mapListIndexToListScores", () => {
    SCORES_INDEX_MAP.forEach((score, index) => {
      expect(
        mapListIndexToListScores(index, MOCKS.DEFAULT_SCORE_STATE),
      ).toEqual(MOCKS.DEFAULT_SCORE_STATE[score]);
    });
  });

  test("getLessonSummaryStatus", () => {
    let result = getLessonSummaryStatus(false, MOCKS.DEFAULT_SCORE_STATE, 0);
    expect(result).toMatchInlineSnapshot(`
                  Object {
                    "mandarinPronunciation": true,
                    "mcEnglish": true,
                    "mcMandarin": true,
                    "quizText": true,
                  }
            `);

    result = getLessonSummaryStatus(true, MOCKS.DEFAULT_SCORE_STATE, 0);
    expect(result).toMatchInlineSnapshot(`
                  Object {
                    "mandarinPronunciation": false,
                    "mcEnglish": false,
                    "mcMandarin": false,
                    "quizText": false,
                  }
            `);

    result = getLessonSummaryStatus(true, MOCKS.DEFAULT_SCORE_STATE, 1);
    expect(result).toMatchInlineSnapshot(`
                  Object {
                    "mandarinPronunciation": false,
                    "mcEnglish": false,
                    "mcMandarin": false,
                    "quizText": false,
                  }
            `);

    result = getLessonSummaryStatus(
      true,
      MOCKS.getMockScoreStatus({
        mc_english: true,
        mc_mandarin: true,
        quiz_text: false,
        mandarin_pronunciation: true,
        list_02_score: {
          complete: false,
          list_index: 0,
          list_key: "1-2",
          number_words_completed: 120,
        },
      }),
      1,
    );
    expect(result).toMatchInlineSnapshot(`
            Object {
              "mandarinPronunciation": true,
              "mcEnglish": true,
              "mcMandarin": true,
              "quizText": false,
            }
        `);
  });

  test("getQuizSuccessToasts", () => {
    let result = getQuizSuccessToasts(true, true, "LESSON", 158, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "The next lesson is unlocked! 🥇",
        "secondary": "Great - keep going! 很好! You earned 158 experience points!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "LESSON", 158, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "Amazing! You passed this lesson! 💯",
        "secondary": "Congratulations! You gained 158 experience points!",
      }
    `);

    result = getQuizSuccessToasts(true, false, "LESSON", 158, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "The next lesson is unlocked! 🥇",
        "secondary": "Great - keep going! 很好! You earned 158 experience points!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "LESSON", 158, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "Amazing! You passed this lesson! 💯",
        "secondary": "Congratulations! You gained 158 experience points!",
      }
    `);

    result = getQuizSuccessToasts(false, false, "SUMMARY", 158, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "You finished the quiz!",
        "secondary": "All words completed, 很好！ Try again to get a perfect score to unlock the next lesson.",
      }
    `);

    result = getQuizSuccessToasts(false, true, "OPT_OUT_CHALLENGE", 158, false);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "You passed but not with a perfect score!",
        "secondary": "You can try again anytime to still unlock the HSK Level, good luck!",
      }
    `);

    result = getQuizSuccessToasts(false, true, "DAILY_QUIZ", 158, true);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "primary": "Excellent!!!",
        "secondary": "You gained 158 points!",
      }
    `);
  });

  test("calculateExperiencePointsForLesson", () => {
    let result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.QUIZ_TEXT,
      "LESSON",
      APP_DIFFICULTY_SETTING.EASY,
    );
    expect(result < 35).toBeTruthy();
    expect(result > 15).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.MANDARIN,
      "DAILY_QUIZ",
      APP_DIFFICULTY_SETTING.EASY,
    );

    expect(result < 500).toBeTruthy();
    expect(result > 15).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.MANDARIN,
      "OPT_OUT_CHALLENGE",
      APP_DIFFICULTY_SETTING.EASY,
    );

    expect(result < 1000).toBeTruthy();
    expect(result > 15).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.QUIZ_TEXT,
      "LESSON",
      APP_DIFFICULTY_SETTING.HARD,
    );
    expect(result < 105).toBeTruthy();
    expect(result > 15).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.MANDARIN,
      "DAILY_QUIZ",
      APP_DIFFICULTY_SETTING.HARD,
    );

    expect(result < 500).toBeTruthy();
    expect(result > 15).toBeTruthy();

    result = calculateExperiencePointsForLesson(
      true,
      true,
      QUIZ_TYPE.MANDARIN,
      "OPT_OUT_CHALLENGE",
      APP_DIFFICULTY_SETTING.HARD,
    );

    expect(result < 1000).toBeTruthy();
    expect(result > 15).toBeTruthy();
  });
});
