import { HSKList } from "@src/tools/types";

// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Words to add:
const words: ReadonlyArray<string> = [
  "一共",
  "多少",
  "錢",
  "老闆",
  "買",
  "杯",
  "熱",
  "包子",
  "要",
  "大",
  "中",
  "小",
  "棒",
  "微波",
  "百",
  "塊",
  "好的",
  "外帶",
  "內用",
  "支",
  "新",
  "手機",
  "太",
  "舊",
  "了",
  "種",
  "能",
  "上網",
  "那",
  "貴",
  "賣",
  "便宜",
  "萬",
  "千",
];

// Words to add:
const dictationWords: ReadonlyArray<string> = [
  "共",
  "少",
  "錢",
  "闆",
  "買",
  "被",
  "熱",
  "包",
  "大",
  "幫",
  "微",
  "波",
  "百",
  "塊",
  "外",
  "帶",
  "內",
  "用",
  "支",
  "新",
  "手",
  "幾",
  "太",
  "舊",
  "了",
  "種",
  "能",
  "那",
  "貴",
  "賣",
  "便",
  "宜",
  "萬",
  "千",
  "為",
];

export const content = words.filter(Boolean).map(traditional => ({
  traditional,
  simplified: "",
  pinyin: "",
  english: "",
}));

export const dictation = dictationWords.filter(Boolean).map(traditional => ({
  traditional,
  simplified: "",
  pinyin: "",
  english: "",
}));

// Metadata for lesson:
export const lesson: HSKList = {
  list: "11",
  locked: false,
  title: "MTC Book 1 Lesson 4",
  content,
  dictation,
};
