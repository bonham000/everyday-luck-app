/**
 * Source for quiz content:
 */

export interface Word {
  mandarin: string;
  pinyin: string;
  english: string;
}

const Content = [
  {
    mandarin: "我是",
    pinyin: "Wǒ shì",
    english: "I am",
  },
  {
    mandarin: "很好",
    pinyin: "Hěn hǎo",
    english: "Very good",
  },
  {
    mandarin: "謝謝",
    pinyin: "Xièxiè",
    english: "Thank you",
  },
  {
    mandarin: "早上好",
    pinyin: "Zǎoshang hǎo",
    english: "Good morning",
  },
  {
    mandarin: "你忙嗎?",
    pinyin: "nǐ máng ma?",
    english: "Are you busy?",
  },
  {
    mandarin: "我是美國人",
    pinyin: "Wǒ shì měiguó rén",
    english: "I am american",
  },
  {
    mandarin: "歡迎大家",
    pinyin: "Huānyíng dàjiā",
    english: "Welcome everyone",
  },
  {
    mandarin: "我正在学习普通话",
    pinyin: "Wǒ zhèngzài xuéxí pǔtōnghuà",
    english: "I am learning mandarin",
  },
];

export default (process.env.NODE_ENV === "development"
  ? Content.slice(0, 2)
  : Content);
