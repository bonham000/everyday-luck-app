import { Translate } from "@google-cloud/translate";

const translate = new Translate();

const traditionalChinese = "zh-TW";

const translateText = async (
  input: string,
  targetLanguage: string = traditionalChinese,
) => {
  console.log(`Translating ${input} into ${targetLanguage}`);
  let [translations] = await translate.translate(input, targetLanguage);
  translations = Array.isArray(translations) ? translations : [translations];

  const translation = translations[0];
  console.log(`Translation: ${translation}`);

  return translation;
};

export default translateText;
