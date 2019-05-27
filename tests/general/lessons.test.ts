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

  test("All word English values are capitalized", () => {
    const lessons = HSK_LISTS;
    for (const lesson of lessons) {
      for (const word of lesson.content) {
        const { english } = word;
        expect(english.charAt(0)).toBe(english.charAt(0).toUpperCase());
      }
    }
  });
});
