import React from "react";

import { Lesson } from "@src/tools/types";

/** ========================================================================
 * Types and Config
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

/** ========================================================================
 * Context for SoundRecordingProvider
 * =========================================================================
 */

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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default SoundRecordingContext;
