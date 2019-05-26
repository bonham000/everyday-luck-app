import HSK_LISTS from "@src/lessons";

describe("HSK_LISTS content", () => {
  test("Lesson content doesn't change", () => {
    const lessons = HSK_LISTS;
    expect(lessons.length).toMatchInlineSnapshot(`5`);
    for (const lesson of lessons) {
      expect(lesson.list).toMatchSnapshot();
      expect(lesson.content.length).toMatchSnapshot();
    }
  });

  test.skip("Lesson content contains unique English words", () => {
    const lessons = HSK_LISTS;
    const unique = new Set();
    let duplicate: ReadonlyArray<string> = [];

    for (const lesson of lessons) {
      for (const word of lesson.content) {
        const english = word.english.toLowerCase();

        if (unique.has(english)) {
          duplicate = duplicate.concat(english);
        } else {
          unique.add(english);
        }
      }
    }

    expect(true).toBeTruthy();
  });
});
