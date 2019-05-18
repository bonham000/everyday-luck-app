import fs from "fs";

import { fetchLessonSet } from "@src/tools/api";
import { audioRecordingsClass } from "@src/tools/dictionary";
import { flattenLessonSet, prefetchWordsList } from "@src/tools/utils";

const scrapAudioRecordings = async () => {
  const lessonSet = await fetchLessonSet();

  if (!lessonSet) {
    return console.log("Could not fetch lessons!");
  }

  const flattenedLessons = flattenLessonSet(lessonSet);

  const missingWords = flattenedLessons
    .filter(
      word => !audioRecordingsClass.audioRecordingExists(word.traditional),
    )
    .map(word => word.traditional);

  if (missingWords.length === 0) {
    return console.log("\nNo words found without recordings - aborting.\n");
  }

  console.log(
    `Found ${missingWords.length} words without recordings out of a total of ${
      flattenedLessons.length
    } words - processing now...`,
  );

  const result = await prefetchWordsList(missingWords);

  const updatedDictionary = {
    ...audioRecordingsClass.getFullDictionaryObject(),
    ...result,
  };

  console.log("Writing JSON result...");
  fs.writeFileSync(
    "src/assets/audio-result.json",
    JSON.stringify(updatedDictionary),
    "utf8",
  );
  console.log("\nFinished!\n");
};

scrapAudioRecordings();
