import fs from "fs";

import { HSKList, TRADITIONAL_CHINESE, Word } from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";
import { content, lesson } from "./words_list";

// Flag to modify existing lesson or use new word list
const USE_EXISTING_LESSON = true;

// Read existing lesson file
import existingLesson from "@src/lessons/08";

const existingLessonWithContent = {
  ...existingLesson,
  content: existingLesson.content.concat(content),
};

const targetLesson = USE_EXISTING_LESSON ? existingLessonWithContent : lesson;

// Replace the following with the custom word list index:
const LIST_INDEX = targetLesson.list;
const FILE_KEY = Number(LIST_INDEX) < 10 ? `0${LIST_INDEX}` : LIST_INDEX;
const FILENAME = `src/lessons/${FILE_KEY}.ts`;

// Create the file contents
const getFileContents = (
  data: string,
) => `import { HSKList } from "@src/tools/types";
const lesson: HSKList = ${data}

export default lesson;`;

// Write the results to a JSON file
const writeListToJson = (result: ReadonlyArray<Word>) => {
  console.log(`Writing JSON result to file: ${FILENAME}\n`);
  const list: HSKList = { ...targetLesson, content: result };
  const data = JSON.stringify(list, null, 2);
  const file = getFileContents(data);
  fs.writeFileSync(FILENAME, file, "utf8");
};

// Process the list and fill in the content for each word
const processListAndTranslateSimplifiedToTraditional = async (
  list: ReadonlyArray<Word>,
) => {
  const translated = await Promise.all(
    list
      .filter(x => !!x.traditional)
      .map(async word => {
        const wordComplete =
          word.traditional && word.simplified && word.pinyin && word.english;

        if (wordComplete) {
          return word;
        } else {
          return translateWord(word.traditional, TRADITIONAL_CHINESE);
        }
      }),
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
const processWordList = async () => {
  console.log(`Processing word list, generating file: ${FILENAME}\n`);
  await processListAndTranslateSimplifiedToTraditional(targetLesson.content);
  console.log("Finished!\n");
};

// Run it!
processWordList();
