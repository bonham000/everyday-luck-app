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
  "我去花蓮玩一個星期。",
  "這個電影很有意思，可是要看三個鐘頭。",
  "中文，我想學一年半。",
  "我去日本旅行一個多星期。",
  "這麼多甜點，我們要吃一個星期。",
  "我想坐高鐵去台南玩兩天。",
  "中文課，我們學校要上四年。",
  "他打算腳中文教一年。",
  "我每個星期學書法學兩天。",
  "今年我想在台灣學中文學九個月。",
  "他太忙了，所以他倆天不能來上課。",
  "這裡沒有網路，所以我兩個星期不能上網。",
  "他要回美國，所以一個月不能上課。",
  "我每星期上五天的課。",
  "學校下個月放三天的假。",
  "我們打算明天去KTV長三個鐘頭的歌。",
  "你決定在台灣學多久的中文？",
  "在山上看風景的時候，我覺得很舒服。",
  "放假的時候，我喜歡去逛夜市。",
  "你有空的時候，請到我家來玩。",
  "我有時候吃中國菜，有時候吃越南菜。",
  "在圖書館的時候，我有時候看書，有時候上網。",
  "放假的時候，我有時候在家寫功課，有時候出去玩。",
  "要是我有錢，我就買大房子。",
  "我要是不會過，我就跟你們一起去玩。",
  "要是我有空，我就跟朋友一起去KYV唱歌。",
  "你要是星期日有空，你就跟我去旅行吧！",
  "要是下個月不忙，他就回國。",
  "你要是沒空，我們就不要去逛夜市。",
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
  const filtered = content.filter(Boolean);
  const results = [];
  console.log(`\n-> Beginning translation of ${filtered.length} items:`);
  for (const word of filtered) {
    const result = await translateText(word);
    results.push(result);
  }
  console.log("-> Translation complete!");
  writeListToJson(results);
};

translateWordsList(textContent);
