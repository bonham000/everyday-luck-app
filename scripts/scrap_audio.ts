import { prefetchWordsList } from "@src/tools/utils";

const words: ReadonlyArray<string> = [
  "我",
  "我們",
  // "你",
  // "你們",
  // "他",
  // "她",
  // "他們",
  // "她們",
  // "天天",
];

const scrap = async () => {
  const result = await prefetchWordsList(words);
  console.log(result);
};

scrap();
