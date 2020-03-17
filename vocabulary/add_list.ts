import fs from "fs";

import { HSKList, Lesson, TRADITIONAL_CHINESE } from "@src/tools/types";
import { capitalize, translateWord } from "@src/tools/utils";
import * as CustomList from "./words_list";

// Flag to modify existing lesson or use new word list
const USE_EXISTING_LESSON = true;

// Read existing lesson file
import existingLesson from "@src/lessons/10";

const existingLessonWithContent = {
  ...existingLesson,
  content: existingLesson.content.concat(CustomList.content),
};

const targetLesson = USE_EXISTING_LESSON
  ? existingLessonWithContent
  : CustomList.lesson;

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
  const list: HSKList = { ...targetLesson, content, dictation };
  const data = JSON.stringify(list, null, 2);
  const file = getFileContents(data);
  fs.writeFileSync(FILENAME, file, "utf8");
};

// Process the list and fill in the content for each word
const translateList = async (list: Lesson) => {
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
  console.log(targetLesson);

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
