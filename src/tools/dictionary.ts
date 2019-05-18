import AudioRecordings from "@src/assets/audio-result.json";
import { AudioItem } from "@src/tools/types";

interface IAudioRecordingsDictionary {
  [key: string]: ReadonlyArray<AudioItem>;
}

class AudioRecordingsClass {
  recordings: IAudioRecordingsDictionary = AudioRecordings;

  getAudioRecordingsForWord = (word: string): AudioItem => {
    const result = this.recordings[word][0];

    return result;
  };

  audioRecordingExists = (word: string): boolean => {
    return word in this.recordings;
  };

  getFullDictionaryObject = () => {
    return this.recordings;
  };
}

export const audioRecordingsClass = new AudioRecordingsClass();
