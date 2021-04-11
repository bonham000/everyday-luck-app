import fs from "fs";
import generatePinyin from "chinese-to-pinyin";
import { TranslationServiceClient } from "@google-cloud/translate";

import { Word } from "@src/tools/types";
import { capitalize } from "@src/tools/utils";

/** ===========================================================================
 * Text to Translate
 * ============================================================================
 */

const textContent = [
  "你說的水果是西瓜",
  "他喝的茶是烏龍茶",
  "這些是我拍的照片",
  "穿黃衣服的這個人是老闆",
  "現在去哪裡玩的人比較少",
  "買這種手機的人很多",
];

// ============================================================================

// Write the results to a JSON file
const writeListToJson = (words: Word[]) => {
  const FILENAME = "vocabulary-content.json";
  const data = JSON.stringify(words, null, 2);
  fs.writeFileSync(FILENAME, data, "utf8");
  console.log(`-> Results saved to file: ${FILENAME}\n`);
};

// Instantiates a translation client
const translationClient = new TranslationServiceClient();

// Handle translation and return Word objects
async function translateText(traditional: string): Promise<Word> {
  console.log(`   Translating ${traditional}...`);

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
  const results = [];
  console.log(`\n-> Beginning translation of ${content.length} items:`);
  for (const word of content) {
    const result = await translateText(word);
    results.push(result);
  }
  console.log("-> Translation complete!");
  writeListToJson(results);
};

translateWordsList(textContent);
