import fs from "fs";

import {
  ContentList,
  Lesson,
  TRADITIONAL_CHINESE,
  Word,
} from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";
import * as CustomList from "./words_list";

// Flag to modify existing lesson or use new word list
const USE_EXISTING_LESSON = false;

// Read existing lesson file
import existingLesson from "@src/lessons/08_Contemporary_Chinese_1-7";

const targetLesson = USE_EXISTING_LESSON ? existingLesson : CustomList.lesson;

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
const writeListToJson = (content: Lesson, dictation?: Lesson) => {
  console.log(`Writing JSON result to file: ${FILENAME}\n`);
  const list: ContentList = { ...targetLesson, content, dictation };
  const data = JSON.stringify(list, null, 2);
  const file = getFileContents(data);
  fs.writeFileSync(FILENAME, file, "utf8");
};

const maybeStringToWord = (input: Word | string) => {
  if (typeof input === "string") {
    return {
      traditional: input,
      simplified: "",
      pinyin: "",
      english: "",
    };
  } else {
    return input;
  }
};

// Process the list and fill in the content for each word
const translateList = async (list: Lesson) => {
  const translated = await Promise.all(
    list
      .map(maybeStringToWord)
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

  return translated
    .filter(x => !!x.traditional)
    .map(({ traditional, simplified, english, pinyin }) => ({
      simplified,
      traditional,
      pinyin: Array.isArray(pinyin) ? pinyin[0] : pinyin,
      english: capitalize(english),
    }));
};

// Run the program with log messages
const processWordList = async () => {
  console.log(`Processing word list, generating file: ${FILENAME}\n`);

  let dictation;
  const content = await translateList(targetLesson.content);
  if (targetLesson.dictation) {
    dictation = await translateList(targetLesson.dictation);
  }

  writeListToJson(content, dictation);
  console.log("Finished!\n");
};

// Run it!
processWordList();
