import fs from "fs";

import { HSKList, TRADITIONAL_CHINESE, Word } from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";
import { lesson, words } from "./words_list";

// Replace the following with the custom word list index:
const FILE_INDEX_KEY = `0${lesson.list}`;

// Write the results to a JSON file
const writeListToJson = (
  result: ReadonlyArray<Word>,
  filename: string = `src/lessons/${FILE_INDEX_KEY}-alt.ts`,
) => {
  console.log(`Writing JSON result to file: ${filename}\n`);
  const list: HSKList = { ...lesson, content: result };
  const data = JSON.stringify(list, null, 2);
  const file = `import { HSKList } from "@src/tools/types";

const lesson: HSKList = ${data}

export default lesson;`;

  fs.writeFileSync(filename, file, "utf8");
};

// Process the list and fill in the content for each word
const processListAndTranslateSimplifiedToTraditional = async (
  list: ReadonlyArray<string>,
) => {
  const translated = await Promise.all(
    list.map(async word => translateWord(word, TRADITIONAL_CHINESE)),
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

// Run it!
const main = async () => {
  console.log("Starting translation -\n");
  await processListAndTranslateSimplifiedToTraditional(words);
  console.log("Finished!\n");
};

main();
