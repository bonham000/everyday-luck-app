import AudioRecordings from "@src/assets/audio-result.json";
import { AudioItem, Option, OptionType } from "@src/tools/types";

/** ========================================================================
 * Types & Config
 * =========================================================================
 */

export interface IAudioRecordingsDictionary {
  [key: string]: ReadonlyArray<AudioItem>;
}

/** ========================================================================
 * Class
 * =========================================================================
 */

class AudioRecordingsClass {
  recordings: IAudioRecordingsDictionary = AudioRecordings;

  getFullDictionaryObject = () => {
    return this.recordings;
  };

  hasRecordingForWord = (word: string): boolean => {
    return word in this.recordings;
  };

  getAudioRecordingsForWord = (
    word: string,
  ): Option<ReadonlyArray<AudioItem>> => {
    if (this.hasRecordingForWord(word)) {
      const result = this.recordings[word];
      return {
        data: result,
        type: OptionType.OK,
      };
    } else {
      return {
        type: OptionType.EMPTY,
        message: "Word does not exist",
      };
    }
  };
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export const audioRecordingsClass = new AudioRecordingsClass();
