import fs from "fs";

import { SIMPLIFIED_CHINESE } from "@src/tools/types";
import { translateWord } from "@src/tools/utils";
import vocabularyList2 from "./lists/02";
import vocabularyList3 from "./lists/03";
import vocabularyList4 from "./lists/04";
import vocabularyList5 from "./lists/05";
import vocabularyList6 from "./lists/06";

// @ts-ignore
const lists: ReadonlyArray<ReadonlyArray<string>> = [
  vocabularyList2,
  vocabularyList3,
  vocabularyList4,
  vocabularyList5,
  vocabularyList6,
];

const createItemLiteral = (
  simplified: string,
  traditional: string,
  pinyin: string,
  english: string,
) => {
  return `Item { simplified: "${simplified}", traditional: "${traditional}", pinyin: "${pinyin}", english: "${english}", english_alternate_choices: vec![""], }`;
};

// @ts-ignore
const translateSimplifiedCharactersToTraditional = async (
  simplified: string,
) => {
  const result = await translateWord(simplified, SIMPLIFIED_CHINESE);
  return result.traditional;
};

const parseList = async (vocabulary: ReadonlyArray<string>) => {
  return Promise.all(
    vocabulary.map(async line => {
      const [simplified, traditional, pinyin, ...rest] = line.split(" ");
      const english = rest.join(" ");
      return createItemLiteral(simplified, traditional, pinyin, english);
    }),
  );
};

class WordCache {
  words = new Set();

  hasWord = (word: string) => {
    return this.words.has(word);
  };

  addWord = (word: string) => {
    this.words.add(word);
  };
}

const wordCache = new WordCache();

// @ts-ignore
const processListAndSaveUniqueWords = (
  previousLists: ReadonlyArray<ReadonlyArray<string>>,
  list: ReadonlyArray<string>,
) => {
  for (const previous of previousLists) {
    previous.forEach(line => {
      const [simplified] = line.split(" ");
      wordCache.addWord(simplified);
    });
  }

  const uniqueWords = list.filter(line => {
    const [simplified] = line.split(" ");
    return !wordCache.hasWord(simplified);
  });

  console.log(
    `Found ${uniqueWords.length} unique words - total: ${list.length}`,
  );
  writeListToJson(uniqueWords);
};

// @ts-ignore
const processListAndTranslateSimplifiedToTraditional = async (
  list: ReadonlyArray<string>,
  index: number,
) => {
  console.log(
    `\n~~~ Processing list ${index}- ${list.length} words total ~~~\n`,
  );
  const translated = await Promise.all(
    list.map(async line => {
      const [simplified, ...rest] = line.split(" ");
      const translation = await translateWord(simplified, SIMPLIFIED_CHINESE);
      const reconstruct = [simplified, translation, ...rest].join(" ");
      return reconstruct;
    }),
  );

  writeListToJson(translated, `vocabulary-${index}.json`);
};

// @ts-ignore
const formatAndStandardizeRawList = (list: ReadonlyArray<string>) => {
  const formatted = list
    .map(line => line.trim())
    .filter(line => line.split(" ").length > 2);

  writeListToJson(formatted);
};

const writeListToJson = (
  result: ReadonlyArray<string>,
  fileName: string = "vocabulary.json",
) => {
  console.log("\nWriting JSON result...");
  const data = JSON.stringify({ lists: result });
  fs.writeFileSync(fileName, data, "utf8");
  console.log("\nFinished!\n");
};

const main = async () => {
  console.log("\nProcessing words...");
  const parsedResult = await parseList(vocabularyList6);
  writeListToJson(parsedResult);
};

main();
