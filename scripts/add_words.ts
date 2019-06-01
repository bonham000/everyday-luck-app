import { getDictionaryObject } from "./helpers";

const checkWordAvailability = (words: ReadonlyArray<string>) => {
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

const NEW_WORDS: ReadonlyArray<string> = [""];

checkWordAvailability(NEW_WORDS);
