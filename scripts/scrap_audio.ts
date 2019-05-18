import fs from "fs";
import https from "https";

import { fetchLessonSet } from "@src/tools/api";
import { IAudioRecordingsDictionary } from "@src/tools/audio-dictionary";
import { flattenLessonSet, prefetchWordsList } from "@src/tools/utils";

/**
 * Read the current audio recordings file to get the most recent version.
 */
const getDictionaryObject = () => {
  const file = fs.readFileSync("src/assets/audio-result.json", "utf8");
  return JSON.parse(file) as IAudioRecordingsDictionary;
};

/**
 * Serialize audio recordings data to JSON file.
 */
const saveAudioRecordingsFile = (data: IAudioRecordingsDictionary) => {
  console.log("\nWriting JSON result...");
  fs.writeFileSync(
    "src/assets/audio-result.json",
    JSON.stringify(data),
    "utf8",
  );
  console.log("\nFinished!\n");
};

/**
 * Create the audio/ directory if it does not exist.
 */
const createAudioDirectoryIfNotExists = () => {
  try {
    fs.mkdirSync("audio", { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
};

/**
 * Create a download queue to process downloads sequentially.
 */
class DownloadQueue {
  queue: ReadonlyArray<any> = [];

  enqueueDownload = (word: string, url: string, filePath: string) => {
    const downloadItem = {
      word,
      url,
      filePath,
    };
    // @ts-ignore
    this.queue.push(downloadItem);
  };

  dequeue = () => {
    // @ts-ignore
    return this.queue.pop();
  };

  downloadMp3Async = () => {
    const nextItem = this.dequeue();
    if (nextItem) {
      const { url, word, filePath } = nextItem;
      const file = fs.createWriteStream(`audio/${filePath}.mp3`);
      https.get(url, response => {
        response.pipe(file);
        console.log(`- File written for ${word}`);
        this.downloadMp3Async();
      });
    }
  };
}

const downloadQueue = new DownloadQueue();

/**
 * Scrap audio recordings for any words not recorded yet.
 */
const scrapAudioRecordings = async () => {
  const lessonSet = await fetchLessonSet();

  if (!lessonSet) {
    return console.log("Could not fetch lessons!");
  }

  const dictionary = getDictionaryObject();

  const flattenedLessons = flattenLessonSet(lessonSet);

  const wordsToFetch = flattenedLessons
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
 * Fetch and save the mp3 file for a word.
 */
const fetchAndSaveMp3File = (word: string, url: string, filePath: string) => {
  downloadQueue.enqueueDownload(word, url, filePath);
};

/**
 * Update the word dictionary with the new file path.
 */
const updateAudioItemFilePath = (
  wordKey: string,
  index: number,
  filePathKey: string,
  dictionary: IAudioRecordingsDictionary,
) => {
  // tslint:disable-next-line
  delete dictionary[wordKey][index]["pathmp3"];
  // tslint:disable-next-line
  delete dictionary[wordKey][index]["pathogg"];
  // tslint:disable-next-line
  dictionary[wordKey][index]["filePath"] = filePathKey;
};

/**
 * Fetch all the mp3 files for the existing word dictionary which have
 * been fetched yet.
 */
const fetchMp3Files = () => {
  createAudioDirectoryIfNotExists();
  const dictionary = getDictionaryObject();
  for (const wordKey in dictionary) {
    const result = dictionary[wordKey];
    if (result) {
      result.forEach((audioItem, index) => {
        if (audioItem.pathmp3) {
          const url = audioItem.pathmp3;
          const filePathKey = `${wordKey}-${index}`;
          fetchAndSaveMp3File(wordKey, url, filePathKey);
          updateAudioItemFilePath(wordKey, index, filePathKey, dictionary);
        }
      });
    }
  }
  console.log("Updating audio recordings file...");
  saveAudioRecordingsFile(dictionary);
};

const updateAudioRecordingsData = async () => {
  await scrapAudioRecordings();
  fetchMp3Files();

  console.log("Initializing mp3 downloads...");
  downloadQueue.downloadMp3Async();
};

/* Run the program - */
updateAudioRecordingsData();
