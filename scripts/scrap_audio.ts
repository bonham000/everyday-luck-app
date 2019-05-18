import fs from "fs";
import http from "http";

import { fetchLessonSet } from "@src/tools/api";
import { IAudioRecordingsDictionary } from "@src/tools/dictionary";
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
  const file = fs.createWriteStream(`audio/${filePath}.mp3`);
  console.log(`- Fetching mp3 for ${word}`);
  http.get(url, response => {
    response.pipe(file);
    console.log(`- File written for ${word}`);
  });
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
          const url = audioItem.pathmp3.replace("https", "http");
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
};

/* Run the program - */
updateAudioRecordingsData();
