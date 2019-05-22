import { fetchLessonWords, getDictionaryObject } from "./helpers";

/**
 * Print a status message for how many words still need to be
 * fetched.
 */
const generateStatusMessage = async () => {
  const lessons = await fetchLessonWords();
  if (!lessons) {
    return console.log("Failed to fetch lessons!");
  }

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

  console.log("\nStatus Report:\n");
  console.log(
    `\n- Total of number of words to fetch files for: ${toFetch.length}`,
  );
  console.log(`- Total of unprocessed words ${tasks.length}`);
  console.log(`\n- Total of number lesson words: ${lessons.length}`);
  console.log(`- Total of number audio files: ${totalAudioFiles}`);
  console.log("\nFinished!\n");
};

generateStatusMessage();
