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
const words: ReadonlyArray<string> = [
  "陳",
  "月",
  "美",
  "李",
  "明",
  "華",
  "王",
  "開",
  "文",
  "你",
  "來",
  "是",
  "小",
  "姐",
  "嗎",
  "接",
  "我",
  "們",
  "這",
  "先",
  "生",
  "好",
  "姓",
  "叫",
  "臺",
  "灣",
  "歡",
  "迎",
  "請",
  "問",
  "的",
  "謝",
  "不",
  "客",
  "氣",
  "喝",
  "茶",
];

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
