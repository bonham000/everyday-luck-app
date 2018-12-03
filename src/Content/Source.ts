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
    mandarin: "你忙嗎",
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
    mandarin: "我正在學習普通話",
    pinyin: "Wǒ zhèngzài xuéxí pǔtōnghuà",
    english: "I am learning mandarin",
  },
  {
    mandarin: "這個",
    pinyin: "Zhège",
    english: "This",
  },
  {
    mandarin: "我吃",
    pinyin: "Wǒ chī",
    english: "I eat",
  },
  {
    mandarin: "蛋糕",
    pinyin: "Dàngāo",
    english: "Cake",
  },
  {
    mandarin: "冰淇淋",
    pinyin: "Bīngqílín",
    english: "Ice cream",
  },
  {
    mandarin: "不好",
    pinyin: "Bù hǎo",
    english: "Not good",
  },
  {
    mandarin: "老師",
    pinyin: "Lǎoshī",
    english: "Teacher",
  },
  {
    mandarin: "經理",
    pinyin: "Jīnglǐ",
    english: "Manager",
  },
  {
    mandarin: "同事",
    pinyin: "Tóngshì",
    english: "Colleague",
  },
  {
    mandarin: "開發工程師",
    pinyin: "Kāifā gōngchéngshī",
    english: "Software developer",
  },
  {
    mandarin: "魚",
    pinyin: "Yú",
    english: "Fish",
  },
  {
    mandarin: "早餐",
    pinyin: "Zǎocān",
    english: "Breakfast",
  },
  {
    mandarin: "午餐",
    pinyin: "Wǔcān",
    english: "Lunch",
  },
  {
    mandarin: "晚餐",
    pinyin: "Wǎncān",
    english: "Dinner",
  },
  {
    mandarin: "你叫什麼名字",
    pinyin: "Nǐ jiào shénme míngzì",
    english: "What is your name?",
  },
  {
    mandarin: "你的職業是什麼",
    pinyin: "Nǐ de zhíyè shì shénme",
    english: "What is your occupation?",
  },
  {
    mandarin: "我怎麼說",
    pinyin: "Wǒ zěnme shuō",
    english: "How do I say?",
  },
  {
    mandarin: "這很難",
    pinyin: "Zhè hěn nán",
    english: "It is difficult",
  },
];

export default (process.env.NODE_ENV === "development"
  ? Content.slice(0, 2)
  : Content);
