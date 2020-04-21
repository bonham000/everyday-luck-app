import { HSKList } from "@src/tools/types";

// Instructions for adding new content:
// 1. Update the lesson block list and title
// 2. Add new traditional characters to the words list
// 3. Run yarn add:list
// 4. Update src/lessons/index.ts to import the new list
// 5. Bump the version and redeploy the app

// Words to add:
const words: ReadonlyArray<string> = [
  "他們",
  "學校",
  "在",
  "山上",
  "哪裡",
  "遠",
  "那裡",
  "風景",
  "美",
  "前面",
  "海",
  "後面",
  "山",
  "真的",
  "地方",
  "現在",
  "附近",
  "樓下",
  "找",
  "朋友",
  "上課",
  "花蓮",
  "聽說",
  "近",
  "方便",
  "這裡",
  "學生",
  "東西",
  "外面",
  "裡面",
  "商店",
  "吃飯",
  "宿舍",
  "樓",
  "棟",
  "大樓",
  "圖書館",
  "旁邊",
  "教師",
  "游泳池",
];

// Words to add:
const dictationWords: ReadonlyArray<string> = [
  "校",
  "在",
  "山",
  "裡",
  "遠",
  "風",
  "景",
  "前",
  "面",
  "海",
  "後",
  "地",
  "方",
  "現",
  "附",
  "近",
  "樓",
  "下",
  "找",
  "朋",
  "友",
  "課",
  "花",
  "蓮",
  "便",
  "棟",
  "西",
  "商",
  "宿",
  "舍",
  "棟",
  "圖",
  "館",
  "旁",
  "邊",
  "教",
  "室",
  "池",
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
  list: "13",
  locked: false,
  title: "MTC Book 1 Lesson 6",
  content,
  dictation,
};
