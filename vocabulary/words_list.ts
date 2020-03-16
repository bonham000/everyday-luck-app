import { HSKList } from "@src/tools/types";

// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Words to add:
const words: ReadonlyArray<string> = [
  "週末",
  "聽",
  "音樂",
  "運動",
  "打",
  "網球",
  "棒球",
  "和",
  "游泳",
  "常",
  "籃球",
  "也",
  "踢",
  "足球",
  "覺得",
  "好玩",
  "明天",
  "早上",
  "去",
  "怎麼樣",
  "啊",
  "做什麼",
  "好啊",
  "今天",
  "晚上",
  "看",
  "電影",
  "妳",
  "想",
  "還是",
  "吧",
  "可以",
  "學",
  "中文",
  "一起",
  "吃",
  "晚飯",
  "菜",
  "越南",
];

export const content = words.filter(Boolean).map(traditional => ({
  traditional,
  simplified: "",
  pinyin: "",
  english: "",
}));

// Metadata for lesson:
export const lesson: HSKList = {
  list: "11",
  locked: false,
  title: "MTC Book 1 Lesson 3",
  content,
};
