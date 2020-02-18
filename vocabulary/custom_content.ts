import fs from "fs";

import { HSKList, TRADITIONAL_CHINESE, Word } from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";

/* Replace this with the custom word list to convert: */
import CustomList from "@src/lessons/11";

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

  const ordered = translated.map(
    ({ traditional, simplified, english, pinyin }) => ({
      simplified,
      traditional,
      pinyin,
      english: capitalize(english),
    }),
  );

  writeListToJson(ordered);
};

const main = async () => {
  console.log("Starting translation -");
  processListAndTranslateSimplifiedToTraditional(CustomList);
};

main();
