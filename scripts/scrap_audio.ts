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
 *
 * @data dictionary data to save
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
 * Create a download queue to process downloads sequentially.
 */
class DownloadQueue {
  failureCount = 0;
  failureThreshold = 5;
  queue: ReadonlyArray<any> = [];
  dictionary: IAudioRecordingsDictionary = {};

  initializeDictionary = () => {
    // tslint:disable-next-line
    this.dictionary = getDictionaryObject();
  };

  enqueueDownload = (
    word: string,
    url: string,
    index: number,
    filePath: string,
  ) => {
    const downloadItem = {
      word,
      url,
      index,
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
      const { url, word, index, filePath } = nextItem;
      const file = fs.createWriteStream(`audio/${filePath}.mp3`);
      https
        .get(url, response => {
          response.pipe(file);
          console.log(`- File written for ${word}`);
          this.updateAudioItemFilePath(word, index, filePath, this.dictionary);
          this.downloadMp3Async();
        })
        .on("error", error => {
          console.log("Error encountered when downloading mp3");
          // tslint:disable-next-line
          this.failureCount = this.failureCount + 1;

          if (this.failureCount > this.failureThreshold) {
            console.log(
              "Failure threshold exceeded - updating dictionary and aborting!",
            );
            saveAudioRecordingsFile(this.dictionary);
          }
        });
    } else {
      console.log("All items finished - saving updated dictionary.");
      saveAudioRecordingsFile(this.dictionary);
    }
  };

  initializeDownloads = () => {
    this.initializeDictionary();
    this.downloadMp3Async();
  };

  updateAudioItemFilePath = (
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
}

const downloadQueue = new DownloadQueue();

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
    console.log("- Initializing mp3 downloads process...");
    downloadQueue.initializeDownloads();
  } else {
    console.log("- No un-fetched files found\n");
  }
};

// @ts-ignore
const updateAudioRecordingsData = async () => {
  await scrapAudioRecordings();
};

/* Scrap audio data - */
// updateAudioRecordingsData();

/* Download mp3s */
fetchMp3Files();
