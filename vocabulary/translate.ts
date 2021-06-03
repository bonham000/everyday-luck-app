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
  "他在踢足球，踢著踢著就踢到學校外面了。",
  "馬安同上星期從他被騎機車騎到花蓮。",
  "這個蛋糕，我打算拿到學校請同學吃。",
  "我在師大下車，沒搭到台北火車站。",
  "張老師跟他太太決定不搬到西班牙了。",
  "我太累了，沒走到故宮，就回家了。",
  "我的事，你明天會拿到學校給我嗎？",
  "那個電腦，你送到他家去了沒有？",
  "本子和筆，你是不是都放到背包裡了？",
  "田中誠一付給房東三個月的房租。",
  "王先生賣給他一輛機車。",
  "他從沒國回來，送給白如玉一些沒國甜點。",
  "他想買給我朋友這個電腦。",
  "語言中心主任昨天才發給白如玉上個月的薪水。",
  "我打算送給我同學這些桌子，椅子。",
  "他想買這個電腦給我朋友。",
  "語言中心主任昨天才發上個月的薪水給白如玉。",
  "我打算送這些桌子，椅子給我同學。",
  "這個電腦，他想買給我朋友。",
  "上個月的薪水，語言中心主任昨天才發給巴如玉。",
  "這些桌子，椅子，我打算送給我同學。",
  "白如玉只要租三個月，所以那個房間，房東不租給他了。",
  "田中誠一還沒付給房東上個月的房租。",
  "因為陳小姐快回國了，所以我不給他介紹工作了。",
  "你的腳踏車，賣給白如玉了沒有？",
  "那些芒果跟甜點，你是不是送給陳月美了？",
  "下個月中文課的學費，你付給學校了沒有？",
  "我要賣我朋友這個電腦。",
  "我打算送我同學這些桌子，椅子。",
  "你和道公司付他多少薪水嗎？",
  "那張椅子，請你放在樓下。",
  "這些複雜的漢字，我要寫在本子上。",
  "履歷表先留在我這裡，有適合的工作再告訴你。",
  "書別放在椅子上，請拿到房間去。",
  "我妹留甜點在桌子上，我把甜點吃了。",
  "他的錢沒存在銀行裡，他太太很不高興。",
  "電視，你打算放在哪裡？",
  "這些家具，你是不是要留在這裡，不搬到新家？",
  "我給你的資料，你存在電腦裡沒有？",
  "我把球踢到學校外面了。",
  "他想把公司搬到台南。",
  "我打算把這個蛋糕那到學校請同學吃。",
  "我要把這吃茶送給老師。",
  "請你把那衣服服拿給白如玉。",
  "我打算把舊車賣給高先生",
  "請你把那張椅子放在樓下。",
  "我要把媽媽給我的錢存在銀行裡。",
  "他沒把資料帶到學校來，可是還好我帶了。",
  "別把那本事賣給別人，買給我吧。",
  "我還沒把這個月的房租那給房東。",
  "他還沒把這個月的房租那給房東。",
  "他還沒把買電視的錢付給老闆。",
  "別把隨身碟放在桌子上。",
  "他沒把錢放在我這裡，她帶回家了。",
  "你是不是把我的書帶到學校來了？",
  "他把錢車騎到公司來了沒有？我等一下要用。",
  "你把那本本子拿給老師了沒有？",
  "你是不是把照相機送給他了？",
  "房東是不是把熱水器裝在於是外面了？",
  "你把學費用在什麼他方了？",
  "台灣的夏天熱而且濕。",
  "如果多花一點時間我，一定能到便宜而且合適的。",
  "房東幫他裝了有線電視，而且還幫他裝了網路。",
  "做這個工作得會說中文，而且得有一些工作經驗。",
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
