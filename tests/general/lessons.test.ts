import HSK_LISTS from "@src/lessons";
import { APP_DIFFICULTY_SETTING } from "@src/providers/GlobalStateContext";
import { adjustListContentByDifficultySetting } from "@src/tools/utils";

describe.only("HSK_LISTS content", () => {
  test("Lesson content doesn't change", () => {
    const lessons = HSK_LISTS;
    expect(lessons.length).toMatchInlineSnapshot(`7`);
    for (const lesson of lessons) {
      expect(lesson.list).toMatchSnapshot();
      expect(lesson.content.length).toMatchSnapshot();
    }
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
