import { fetchLessonWords, getDictionaryObject } from "./vocabulary-helpers";

/**
 * Print a status message for how many words still need to be
 * fetched.
 */
const generateStatusMessage = async () => {
  const lessons = await fetchLessonWords();

  let totalAudioFiles = 0;
  let tasks: ReadonlyArray<string> = [];
  const dictionary = getDictionaryObject();

  const toFetch = lessons
    .filter(word => {
      const existing = dictionary[word.traditional];
      return !existing;
    })
    .map(word => word.traditional);

  for (const wordKey in dictionary) {
    const result = dictionary[wordKey];
    if (result) {
      totalAudioFiles += result.length;
      result.forEach(audioItem => {
        if (audioItem.pathmp3) {
          tasks = tasks.concat(wordKey);
        }
      });
    }
  }

  const missingAudioFiles: ReadonlyArray<string> = [];

  for (const key of Object.keys(dictionary)) {
    if (dictionary[key].length === 0) {
      // @ts-ignore
      missingAudioFiles.push(key);
    }
  }

  console.log("\nStatus Report:\n");
  console.log(
    `- Total of number of words to fetch files for: ${toFetch.length}`,
  );
  console.log(`- Total of unprocessed words ${tasks.length}`);
  console.log(`\n- Total of number lesson words: ${lessons.length}`);
  console.log(`- Total of number audio files: ${totalAudioFiles}`);
  console.log(
    `- Total of words without audio files: ${missingAudioFiles.length}`,
  );
  console.log("\nFinished!\n");
};

generateStatusMessage();
