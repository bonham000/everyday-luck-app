import fs from "fs";

import { HSKList, TRADITIONAL_CHINESE, Word } from "@src/tools/types";
import { translateWord } from "@src/tools/utils";

/* Replace this with the custom word list to convert: */
import CustomList from "@src/lessons/08";

const writeListToJson = (
  result: ReadonlyArray<Word>,
  fileName: string = "custom_vocabulary_list.json",
) => {
  console.log("\nWriting JSON result...");
  const data = JSON.stringify({ ...CustomList, content: result });
  fs.writeFileSync(fileName, data, "utf8");
  console.log("\nFinished!\n");
};

const processListAndTranslateSimplifiedToTraditional = async (
  list: HSKList,
) => {
  const translated = await Promise.all(
    list.content
      .filter(({ traditional }) => Boolean(traditional))
      .map(async word => {
        const { traditional, simplified, english, pinyin } = word;

        if (
          Boolean(pinyin) &&
          Boolean(english) &&
          Boolean(simplified) &&
          Boolean(traditional)
        ) {
          return word;
        } else {
          return translateWord(traditional, TRADITIONAL_CHINESE);
        }
      }),
  );

  writeListToJson(translated);
};

const main = async () => {
  console.log("Starting translation -");
  processListAndTranslateSimplifiedToTraditional(CustomList);
};

main();
