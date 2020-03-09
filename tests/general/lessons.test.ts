import HSK_LISTS from "@src/lessons";
import { APP_DIFFICULTY_SETTING } from "@src/providers/GlobalStateContext";
import { adjustListContentByDifficultySetting } from "@src/tools/utils";

describe("HSK_LISTS content", () => {
  test("No lesson quiz can have overlapping English words", () => {
    for (const list of HSK_LISTS.slice(0, 5)) {
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
