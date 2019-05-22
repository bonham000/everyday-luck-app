import React from "react";

import { Lesson } from "@src/tools/types";

/** ========================================================================
 * Context for SoundRecordingProvider
 * =========================================================================
 */

export interface AudioMetadata {
  loading: boolean;
  playedOnce: boolean;
  playbackError: boolean;
}

export interface AudioMetadataCache {
  [key: string]: AudioMetadata;
}

const SoundRecordingContext = React.createContext({
  playbackError: false,
  loadingSoundData: false,
  audioMetadataCache: {},
  handlePronounceWord: (traditionalCharacters: string) => {
    // Handle pronouncing word
  },
  prefetchLessonSoundData: async (lesson: Lesson) => {
    // Handle pre-fetching sound data for lesson
  },
});

export default SoundRecordingContext;
