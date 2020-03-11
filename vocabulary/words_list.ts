import { HSKList } from "@src/tools/types";

// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Words to add:
const words: ReadonlyArray<string> = [
  "謝",
  "不",
  "客",
  "氣",
  "喝",
  "茶",
  "很",
  "什",
  "麼",
  "人",
  "喜",
  "呢",
  "他",
  "哪",
  "要",
  "咖",
  "啡",
  "烏",
  "龍",
  "日",
  "本",
  "國",
  "對",
  "起",
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

export const content = words.filter(Boolean).map(traditional => ({
  traditional,
  simplified: "",
  pinyin: "",
  english: "",
}));

// Metadata for lesson:
export const lesson: HSKList = {
  list: "8",
  locked: false,
  title: "Dictation",
  content,
};
