import AudioRecordings from "@src/assets/audio-result.json";
import { AudioItem } from "@src/tools/utils";

interface IAudioRecordingsDictionary {
  [key: string]: ReadonlyArray<AudioItem>;
}

const AudioRecordingsDictionary: IAudioRecordingsDictionary = AudioRecordings;

export const getAudioRecordingsForWord = (word: string): AudioItem => {
  const result = AudioRecordingsDictionary[word][0];

  return result;
};
