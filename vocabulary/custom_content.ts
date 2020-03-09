import fs from "fs";

import { HSKList, TRADITIONAL_CHINESE, Word } from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";

/* Replace this with the custom word list to convert: */
import CustomList from "@src/lessons/07";

const writeListToJson = (
  result: ReadonlyArray<Word>,
  filename: string = "src/lessons/07.ts",
) => {
  console.log(`Writing JSON result to file: ${filename}\n`);
  const list = { ...CustomList, content: result };
  const data = JSON.stringify(list, null, 2);
  fs.writeFileSync(filename, data, "utf8");
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
  console.log("Starting translation -\n");
  await processListAndTranslateSimplifiedToTraditional(CustomList);
  console.log("Finished!\n");
};

main();
