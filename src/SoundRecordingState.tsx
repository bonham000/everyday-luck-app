import { Audio } from "expo";
import React from "react";

import { AudioItem, Lesson } from "@src/tools/types";

/** ========================================================================
 * Context for SoundRecordingProvider
 * =========================================================================
 */

const GlobalState = React.createContext({
  getSoundFileForWord: (traditionalCharacters: string) => {
    // Return sound file for given word
  },
  prefetchLessonSoundData: async (lesson: Lesson) => {
    // Handle pre-fetching sound data for lesson
  },
  fetchSoundFilesForWord: async (
    soundData: ReadonlyArray<AudioItem>,
  ): Promise<ReadonlyArray<Audio.Sound>> => {
    // Handle fetching sound file for word
    return [];
  },
});

export default GlobalState;
