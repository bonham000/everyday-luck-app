import fs from "fs";

import translateText from "./translate";

import vocabularyList from "./vocabulary";

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
    vocabulary
      .map(line => line.trim())
      .filter(line => line.split(" ").length > 2)
      .map(async line => {
        const [simplified, pinyin = "", english = ""] = line.split(" ");
        const traditional = await translateSimplifiedCharactersToTraditional(
          simplified,
        );
        return createItemLiteral(simplified, traditional, pinyin, english);
      }),
  );
};

const writeListToJson = (result: ReadonlyArray<string>) => {
  console.log("\nWriting JSON result...");
  const data = JSON.stringify({ lists: result });
  fs.writeFileSync("vocabulary.json", data, "utf8");
  console.log("\nFinished!\n");
};

const processWords = async () => {
  console.log("\nProcessing words...");
  const parsedResult = await parseList(vocabularyList);
  writeListToJson(parsedResult);
};

processWords();
