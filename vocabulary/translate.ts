import fs from "fs";
import generatePinyin from "chinese-to-pinyin";
import { TranslationServiceClient } from "@google-cloud/translate";

import { Word } from "@src/tools/types";
import { capitalize } from "@src/tools/utils";

/** ===========================================================================
 * Translation Script Tool, how to use:
 *
 * - Add words or sentences to translation in the array below. Then run:
 *
 * - yarn cli
 * - yarn t
 * - yarn cli:reset
 *
 * - The translated results will be saved to a file vocabulary-content.json
 * in the directory path.
 * ============================================================================
 */

const textContent = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

// ============================================================================

// Write the results to a JSON file
const writeListToJson = (words: Word[]) => {
  const FILENAME = "vocabulary-content.json";
  const data = JSON.stringify(words, null, 2);
  fs.writeFileSync(FILENAME, data, "utf8");
  console.log(`-> Translation complete! Results saved to file: ${FILENAME}\n`);
};

// Instantiates a translation client
const translationClient = new TranslationServiceClient();

// Handle translation and return Word objects
async function translateText(traditional: string): Promise<Word> {
  console.log(`   Translating ${traditional}`);

  const location = "global";
  const projectId = "mandarin-app-1558242151131";

  const options = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [traditional],
    mimeType: "text/plain",
    sourceLanguageCode: "zh-TW",
  };

  const [EnglishResult] = await translationClient.translateText({
    ...options,
    targetLanguageCode: "en",
  });

  const [SimplifiedResult] = await translationClient.translateText({
    ...options,
    targetLanguageCode: "zh-CN",
  });

  const english = capitalize(EnglishResult.translations[0].translatedText);
  const simplified = SimplifiedResult.translations[0].translatedText;
  const pinyin = generatePinyin(traditional);

  const result: Word = {
    traditional,
    simplified,
    pinyin,
    english,
  };

  return result;
}

// Handle translation of text content, write results to a JSON file
const translateWordsList = async (content: string[]) => {
  const filtered = content.filter(Boolean);
  const results = [];
  console.log(`\n-> Beginning translation of ${filtered.length} items:`);
  for (const word of filtered) {
    const result = await translateText(word);
    results.push(result);
  }
  writeListToJson(results);
};

translateWordsList(textContent);
