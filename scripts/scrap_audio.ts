import fs from "fs";

import { getAudioRecordingsForWord } from "@src/tools/dictionary";
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
  const a = getAudioRecordingsForWord("我");
  return console.log(a);

  const result = await prefetchWordsList(words);
  console.log("Writing JSON result...");
  fs.writeFileSync(
    "src/assets/audio-result.json",
    JSON.stringify(result),
    "utf8",
  );
  console.log("Finished!");
};

scrap();
