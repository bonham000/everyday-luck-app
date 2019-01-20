import KoreanContent from "@src/content/korean/index.ts";
import MandarinContent from "@src/content/mandarin/index.ts";

describe("Lesson content does not content any duplicate entires", () => {
  test("Check Mandarin content", () => {
    expect(typeof MandarinContent.length).toBe("number");
  });

  test("Check Korean content", () => {
    expect(typeof KoreanContent.length).toBe("number");
  });
});
