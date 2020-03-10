import fs from "fs";

import { HSKList, TRADITIONAL_CHINESE, Word } from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";
import { lesson, words } from "./words_list";

// Replace the following with the custom word list index:
const FILE_INDEX_KEY = lesson.list;
const FILENAME = `src/lessons/${FILE_INDEX_KEY}.ts`;

// Create the file contents
const getFileContents = (
  data: string,
) => `import { HSKList } from "@src/tools/types";
const lesson: HSKList = ${data}

export default lesson;`;

// Write the results to a JSON file
const writeListToJson = (result: ReadonlyArray<Word>) => {
  console.log(`Writing JSON result to file: ${FILENAME}\n`);
  const list: HSKList = { ...lesson, content: result };
  const data = JSON.stringify(list, null, 2);
  const file = getFileContents(data);
  fs.writeFileSync(FILENAME, file, "utf8");
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
      pinyin: Array.isArray(pinyin) ? pinyin[0] : pinyin,
      english: capitalize(english),
    }),
  );

  writeListToJson(ordered);
};

// Run the program with log messages
const main = async () => {
  console.log(`Processing word list, generating file: ${FILENAME}\n`);
  await processListAndTranslateSimplifiedToTraditional(words);
  console.log("Finished!\n");
};

// Run it!
main();
