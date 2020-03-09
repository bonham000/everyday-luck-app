// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Metadata for lesson:
const lesson = {
  list: "9",
  locked: false,
  title: "MTC Book 1 Lesson 2",
  content: [],
};

// Words to add:
const words: ReadonlyArray<string> = [
  "的",
  "家人",
  "家",
  "漂亮",
  "房子",
  "坐",
  "有",
  "多",
  "照片",
  "都",
  "照相",
  "張",
  "好看",
  "誰",
  "姐姐",
  "妹妹",
  "爸爸",
  "媽媽",
  "請進",
  "伯母",
  "您",
  "名字",
  "書",
  "哥哥",
  "老師",
  "看書",
  "幾",
  "個",
  "沒",
  "兄弟",
  "姐妹",
  "五",
  "兩",
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
