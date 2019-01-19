import AllContent from "@src/content/mandarin/index.ts";

describe("Content only contains unique words one time", () => {
  test("No duplicates exists", () => {
    findDuplicates(AllContent);
    expect(true).toBeTruthy();
  });
});

const findDuplicates = (Content: any) => {
  Content.reduce((set: any, { characters }: any) => {
    if (set.has(characters)) {
      throw new Error(`***** Duplicate word detected!!! -> ${characters}`);
    } else {
      set.add(characters);
    }
    return set;
  }, new Set());
};
