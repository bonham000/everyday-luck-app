import fs from "fs";

import translateText from "./translate";

// @ts-ignore
import vocabularyList2 from "./lists/02";
// @ts-ignore
import vocabularyList3 from "./lists/03";
// @ts-ignore
import vocabularyList4 from "./lists/04";
// @ts-ignore
import vocabularyList5 from "./lists/05";
// @ts-ignore
import vocabularyList6 from "./lists/06";

const LIST = vocabularyList2;

const createItemLiteral = (
  simplified: string,
  traditional: string,
  pinyin: string,
  english: string,
) => {
  return `Item { simplified: "${simplified}", traditional: "${traditional}", pinyin: "${pinyin}", english: "${english}", english_alternate_choices: vec![""], }`;
};

const translateSimplifiedCharactersToTraditional = async (
  simplified: string,
) => {
  return translateText(simplified);
};

const parseList = async (vocabulary: ReadonlyArray<string>) => {
  return Promise.all(
    vocabulary.map(async line => {
      const [simplified, pinyin, ...rest] = line.split(" ");
      const english = rest.join(" ");
      const traditional = await translateSimplifiedCharactersToTraditional(
        simplified,
      );
      return createItemLiteral(simplified, traditional, pinyin, english);
    }),
  );
};

// @ts-ignore
const formatAndStandardizeRawList = (list: ReadonlyArray<string>) => {
  const formatted = list
    .map(line => line.trim())
    .filter(line => line.split(" ").length > 2);

  writeListToJson(formatted);
};

const writeListToJson = (result: ReadonlyArray<string>) => {
  console.log("\nWriting JSON result...");
  const data = JSON.stringify({ lists: result });
  fs.writeFileSync("vocabulary.json", data, "utf8");
  console.log("\nFinished!\n");
};

const processWords = async () => {
  console.log("\nProcessing words...");
  const parsedResult = await parseList(LIST);
  writeListToJson(parsedResult);
};

processWords();
