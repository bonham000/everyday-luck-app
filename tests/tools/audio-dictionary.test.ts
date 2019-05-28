import { audioRecordingsClass } from "@src/tools/audio-dictionary";
import { OptionType } from "@src/tools/types";

describe("audio-dictionary", () => {
  test("Returns provided audio dictionary content correctly", () => {
    const dictionary = audioRecordingsClass.getFullDictionaryObject();
    for (const word in dictionary) {
      expect(audioRecordingsClass.hasRecordingForWord(word)).toBeTruthy();
      const result = audioRecordingsClass.getAudioRecordingsForWord(word);
      expect(result.type).toBe(OptionType.OK);
      if (result.type === OptionType.OK) {
        expect(Array.isArray(result.data)).toBeTruthy();
        result.data.forEach((audioItem, index) => {
          expect(
            audioItem.filePath && audioItem.filePath === `${word}-${index}`,
          ).toBeTruthy();
        });
      }
    }
  });
});
