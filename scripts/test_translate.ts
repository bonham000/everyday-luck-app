import { languageCode } from "@src/tools/types";
import { translateWord } from "@src/tools/utils";

/**
 * Test translation utils.
 *
 * @param word word to translate
 * @param setting source word `languageCode`
 * @returns translation result data
 */
const testTranslate = async (word: string, setting: languageCode) => {
  const result = await translateWord(word, setting);
  console.log(result);
};

testTranslate("我们", "simplified");
testTranslate("我們", "traditional");
testTranslate("pizza", "english");
testTranslate("house", "english");
testTranslate("passport", "english");
