import AudioRecordings from "@src/assets/audio-result.json";
import { AudioItem, Option, OptionType } from "@src/tools/types";

interface IAudioRecordingsDictionary {
  [key: string]: ReadonlyArray<AudioItem>;
}

class AudioRecordingsClass {
  recordings: IAudioRecordingsDictionary = AudioRecordings;

  getAudioRecordingsForWord = (word: string): Option<AudioItem> => {
    if (word in this.recordings) {
      const result = this.recordings[word][0];
      return {
        data: result,
        type: OptionType.OK,
      };
    } else {
      return {
        type: OptionType.EMPTY,
      };
    }
  };

  audioRecordingExists = (word: string): boolean => {
    return word in this.recordings;
  };

  getFullDictionaryObject = () => {
    return this.recordings;
  };
}

export const audioRecordingsClass = new AudioRecordingsClass();
