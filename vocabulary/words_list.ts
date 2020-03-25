import { HSKList } from "@src/tools/types";

// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Words to add:
const words: ReadonlyArray<string> = [
  "網球",
  "棒球",
  "籃球",
  "乒乓球",
  "排球",
  "高爾夫球",
  "冰球",
  "橄欖球",
  "踢足球",
  "游泳",
  "衝浪",
  "慢跑",
  "做瑜伽",
  "爬山",
  "騎馬",
  "騎腳踏車",
  "滑雪",
  "溜滑板",
  "溜冰",
  "跳舞",
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
