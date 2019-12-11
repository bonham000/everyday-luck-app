import HSK_LISTS from "@src/lessons";
import { APP_DIFFICULTY_SETTING } from "@src/providers/GlobalStateContext";
import { adjustListContentByDifficultySetting } from "@src/tools/utils";

const onlyEnglishLetters = (str: string) => /^[a-zA-Z]+$/.test(str);

describe.only("HSK_LISTS content", () => {
  test("Lesson content doesn't change", () => {
    const lessons = HSK_LISTS;
    expect(lessons.length).toMatchInlineSnapshot(`7`);
    for (const lesson of lessons) {
      expect(lesson.list).toMatchSnapshot();
      expect(lesson.content.length).toMatchSnapshot();
    }
  });

  test("All word English values are capitalized and all simplified characters are unique", () => {
    const lessons = HSK_LISTS;
    let totalWordLength = 0;
    const uniqueWordSet = new Set();
    for (const lesson of lessons) {
      totalWordLength += lesson.content.length;
      for (const word of lesson.content) {
        const { english, simplified, traditional } = word;
        expect(english.charAt(0)).toBe(english.charAt(0).toUpperCase());
        uniqueWordSet.add(simplified);
        /* Validate Chinese is Chinese (i.e. not English): */
        expect(onlyEnglishLetters(simplified)).toBeFalsy();
        expect(onlyEnglishLetters(traditional)).toBeFalsy();
      }
    }

    expect(uniqueWordSet.size).toBe(totalWordLength);
  });

  test("No lesson quiz can have overlapping English words", () => {
    for (const list of HSK_LISTS) {
      const batchedLists = adjustListContentByDifficultySetting(
        list.content,
        APP_DIFFICULTY_SETTING.HARD,
      );

      for (const lesson of batchedLists) {
        const uniqueEnglish = new Set();
        for (const word of lesson) {
          uniqueEnglish.add(word.english);
        }
        expect(uniqueEnglish.size).toBe(lesson.length);
      }
    }
  });
});
