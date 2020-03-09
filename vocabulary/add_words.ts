import { getDictionaryObject } from "./vocabulary-helpers";

const checkWordAvailability = (words: ReadonlyArray<string>) => {
  console.log(`\n- Checking for ${words.length} new words\n`);

  const dictionary = getDictionaryObject();

  let unique: ReadonlyArray<string> = [];

  for (const word of words) {
    if (word in dictionary) {
      console.log(`- ${word} already exists`);
    } else {
      unique = unique.concat(word);
    }
  }

  console.log("\nUnique words:\n");
  console.log(unique);
};

const NEW_WORDS: ReadonlyArray<string> = ["擂茶"];

checkWordAvailability(NEW_WORDS);
