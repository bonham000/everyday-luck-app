import {
  createAudioDirectoryIfNotExists,
  DownloadQueue,
  fetchLessonWords,
  getDictionaryObject,
  prefetchWordsList,
  saveAudioRecordingsFile,
} from "./helpers";

const downloadQueue = new DownloadQueue();

/** ========================================================================
 * Methods to handle scraping mp3 data
 * =========================================================================
 */

/**
 * Scrap audio recordings for any words not recorded yet.
 */
const scrapAudioRecordings = async () => {
  const lessons = await fetchLessonWords();
  if (!lessons) {
    return console.log("Failed to fetch lessons!");
  }

  const dictionary = getDictionaryObject();
  console.log(`A total of ${lessons.length} words exist.`);

  const wordsToFetch = lessons
    .filter(word => {
      const existing = dictionary[word.traditional];
      return !existing;
    })
    .map(word => word.traditional);

  if (wordsToFetch.length === 0) {
    return console.log(`All words have been fetched previously!`);
  }

  const result = await prefetchWordsList(wordsToFetch);

  const updatedRecords = {
    ...dictionary,
    ...result,
  };

  saveAudioRecordingsFile(updatedRecords);
};

/**
 * Fetch all the mp3 files for the existing word dictionary which have
 * been fetched yet.
 */
// @ts-ignore
const fetchMp3Files = () => {
  console.log("\n- Processing audio results for available downloads...");
  createAudioDirectoryIfNotExists();

  let tasks = 0;
  const dictionary = getDictionaryObject();

  for (const wordKey in dictionary) {
    const result = dictionary[wordKey];
    if (result) {
      result.forEach((audioItem, index) => {
        if (audioItem.pathmp3) {
          tasks++;
          console.log(`- Preparing to enqueue audio task for ${wordKey}`);
          const url = audioItem.pathmp3;
          const filePathKey = `${wordKey}-${index}`;
          downloadQueue.enqueueDownload(wordKey, url, index, filePathKey);
        }
      });
    }
  }

  if (tasks > 0) {
    downloadQueue.initializeDownloads();
  } else {
    console.log("- No un-fetched files found - exiting!\n");
  }
};

/** ========================================================================
 * Run the Program:
 * =========================================================================
 */

// @ts-ignore
const updateAudioRecordingsData = async () => {
  await scrapAudioRecordings();
};

/* [1] Scrap audio data for un-fetched recordings */
updateAudioRecordingsData();

/* [2] Download mp3s for scraped data */
fetchMp3Files();
