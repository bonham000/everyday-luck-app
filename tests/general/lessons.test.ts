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

  test("All word English values are capitalized and all simplified characters are unique", () => {
    const lessons = HSK_LISTS;
    let totalWordLength = 0;
    const uniqueWordSet = new Set();
    for (const lesson of lessons) {
      totalWordLength += lesson.content.length;
      for (const word of lesson.content) {
        const { english, simplified } = word;
        expect(english.charAt(0)).toBe(english.charAt(0).toUpperCase());
        uniqueWordSet.add(simplified);
      }
    }

    expect(uniqueWordSet.size).toBe(totalWordLength);
  });
});
