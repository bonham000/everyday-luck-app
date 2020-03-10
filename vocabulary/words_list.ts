// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Metadata for lesson:
const lesson = {
  list: "8",
  locked: false,
  title: "Dictation",
  content: [],
};

// Words to add:
const words: ReadonlyArray<string> = [""];

// Export
export { lesson, words };

// @ts-ignore
const emptyStrings: ReadonlyArray<""> = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];
