import fs from "fs";

import HSK_LISTS from "@src/lessons";
import { HSKList } from "@src/tools/types";
import { capitalize } from "@src/tools/utils";

/**
 * Serialize audio recordings data to JSON file.
 *
 * @data dictionary data to save
 */
const saveLessonToJson = (hskList: HSKList) => {
  const PATH = `scripts/lessons/${hskList.list}.json`;
  console.log(`\nWriting JSON dictionary to file: ${PATH}`);
  fs.writeFileSync(PATH, JSON.stringify(hskList.content), "utf8");
  console.log("\nFinished!\n");
};

/**
 * Save all lessons to JSON
 */
const writeLessonsToJson = () => {
  for (const lesson of HSK_LISTS) {
    saveLessonToJson(lesson);
  }
};

// @ts-ignore
const parseForUniqueContent = () => {
  const lessons = HSK_LISTS;

  for (const lesson of lessons) {
    const updatedLesson = {
      list: lesson.list,
      content: lesson.content.map(word => {
        if (word.english.charAt(0) !== word.english.toUpperCase().charAt(0)) {
          return {
            ...word,
            english: capitalize(word.english),
          };
        } else {
          return word;
        }
      }),
    };

    saveLessonToJson(updatedLesson);
  }
};

writeLessonsToJson();
