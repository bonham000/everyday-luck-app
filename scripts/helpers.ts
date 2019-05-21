import fs from "fs";
import https from "https";

import { fetchWordPronunciation } from "@src/tools/api";
import { IAudioRecordingsDictionary } from "@src/tools/audio-dictionary";
import {
  AudioItem,
  Option,
  OptionType,
  ResultType,
  SoundFileResponse,
} from "@src/tools/types";
import { delay } from "@src/tools/utils";

/** ========================================================================
 * Download Queue to handle downloading mp3 files
 * =========================================================================
 */

/**
 * Create a download queue to process downloads sequentially.
 */
export class DownloadQueue {
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
      console.log("\nAll items finished - saving updated dictionary.");
      saveAudioRecordingsFile(this.dictionary);
    }
  };

  initializeDownloads = () => {
    console.log("\nInitializing download queue");
    console.log(`Preparing to download ${this.queue.length} mp3 files...`);
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

/** ========================================================================
 * Helpers to fetch words to process
 * =========================================================================
 */

/**
 * Helper to prefetch audio recordings for a words list.
 *
 * @param words
 * @returns word audio map of results
 */
export const prefetchWordsList = async (words: ReadonlyArray<string>) => {
  const total = words.length;
  let processed = 0;

  console.log(`\nStarting to process words list ---`);
  console.log(`Processing ${total} words:\n`);

  let failureCount = 0;
  const failedThreshold = 5;

  const processWord = async (word: string) => {
    console.log(`- Processing ${word}`);
    const pronunciationResult = await fetchWordPronunciation(word);
    switch (pronunciationResult.type) {
      case ResultType.OK:
        const uriResult = transformSoundFileResponse(pronunciationResult.data);
        if (uriResult.type === OptionType.OK) {
          processed++;
          console.log(
            `- Processing completed - ${
              uriResult.data.length
            } results obtained`,
          );
          return { word, soundData: uriResult.data };
        } else {
          failureCount++;
          return null;
        }
      case ResultType.ERROR:
        failureCount++;
        return null;
    }
  };

  const results: ReadonlyArray<{
    word: string;
    soundData: ReadonlyArray<AudioItem>;
  }> = [];

  for (const word of words) {
    if (failureCount > failedThreshold) {
      console.log("Errors encountered - aborting!");
      break;
    }

    await delay(100);
    const audioResult = await processWord(word);
    // @ts-ignore
    results.push(audioResult);
  }

  const flattenedResults = results.reduce((wordMap, uriResult) => {
    if (uriResult) {
      return {
        ...wordMap,
        [uriResult.word]: uriResult.soundData,
      };
    }

    return wordMap;
  }, {});

  console.log(`\nProcessed a total of ${processed} out of ${total} words -`);

  return flattenedResults;
};

const API_RATE_LIMIT_REACHED = "API_RATE_LIMIT_REACHED";

/**
 * Parse a response from the Forzo API and return audio file uri,
 * wrapped in an Option result type in case no result can be found.
 *
 * @response SoundFileResponse
 * @returns `Option<string>` with uri
 */
export const transformSoundFileResponse = (
  response: SoundFileResponse,
): Option<ReadonlyArray<AudioItem>> => {
  if (Array.isArray(response)) {
    return {
      message: API_RATE_LIMIT_REACHED,
      type: OptionType.EMPTY,
    };
  } else {
    // @ts-ignore
    const sortedByHits = response.items.sort((a: AudioItem, b: AudioItem) =>
      a.hits > b.hits ? -1 : 1,
    );
    return {
      data: sortedByHits,
      type: OptionType.OK,
    };
  }
};

/** ========================================================================
 * File Helpers
 * =========================================================================
 */

/**
 * Read the current audio recordings file to get the most recent version.
 */
export const getDictionaryObject = () => {
  const file = fs.readFileSync("src/assets/audio-result.json", "utf8");
  return JSON.parse(file) as IAudioRecordingsDictionary;
};

/**
 * Serialize audio recordings data to JSON file.
 *
 * @data dictionary data to save
 */
export const saveAudioRecordingsFile = (data: IAudioRecordingsDictionary) => {
  const PATH = "src/assets/audio-result.json";
  console.log(`\nWriting JSON dictionary to file: ${PATH}`);
  fs.writeFileSync(PATH, JSON.stringify(data), "utf8");
  console.log("\nFinished!\n");
};

/**
 * Create the audio/ directory if it does not exist.
 */
export const createAudioDirectoryIfNotExists = () => {
  try {
    fs.mkdirSync("audio", { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
};
