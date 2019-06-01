import { getDictionaryObject } from "./helpers";

const checkWordAvailability = (words: ReadonlyArray<string>) => {
  console.log(`\n- Checking for ${words.length} new words\n`);

  const dictionary = getDictionaryObject();

  let unique: ReadonlyArray<string> = [];

  for (const word of words) {
    if (word in dictionary) {
      console.log(`- ${word} already exists`);
    } else {
      unique = unique.concat(word);
    }
  }

  console.log("\nUnique words:\n");
  console.log(unique);
};

const NEW_WORDS: ReadonlyArray<string> = [
  // "打鸡血",
  // "萌萌哒",
  // "谢谢老板",
  // "老板",
  // "辣眼睛",
  // "方了",
  // "接地气",
  // "一脸懵逼",
  // "吃瓜群众",
  // "土豪",
  // "买",
  // "网红",
  // "不要不要的",
  // "你懂的",
  // "狗带",
  // "腹黑",
  // "老司机",
  // "比心",
  // "吃土",
  // "搞事情",
  // "友谊",
  // "缺心眼儿",
  // "脑洞很大",
  // "吃货",
];

checkWordAvailability(NEW_WORDS);
