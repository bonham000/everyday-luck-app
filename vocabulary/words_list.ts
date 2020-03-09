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
  title: "Custom Vocabulary List",
  content: [],
};

// Words to add:
const words: ReadonlyArray<string> = [
  "你",
  "來",
  "小姐",
  "嗎",
  "接",
  "我",
  "我們",
  "先生",
  "好",
  "姓",
  "叫",
  "你們",
  "台灣",
  "歡迎",
  "請問",
  "是的",
  "謝謝",
  "不客氣",
  "你好",
  "請",
  "喝",
  "茶",
  "很",
  "好喝",
  "什麼",
  "人",
  "喜歡",
  "呢",
  "他",
  "不",
  "哪",
  "要",
  "咖啡",
  "烏龍茶",
  "日本",
  "美國",
  "對不起",
  "哪國",
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
