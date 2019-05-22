import React from "react";

import { Lesson } from "@src/tools/types";

/** ========================================================================
 * Context for SoundRecordingProvider
 * =========================================================================
 */

const SoundRecordingContext = React.createContext({
  playbackError: false,
  loadingSoundData: false,
  pronounceWord: (traditionalCharacters: string) => {
    // Handle pronouncing word
  },
  prefetchLessonSoundData: async (lesson: Lesson) => {
    // Handle pre-fetching sound data for lesson
  },
});

export default SoundRecordingContext;
