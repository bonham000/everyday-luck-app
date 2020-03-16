import React from "react";

/** ========================================================================
 * Context for SoundRecordingProvider
 * =========================================================================
 */

const SoundRecordingContext = React.createContext({
  playbackError: false,
  handlePronounceWord: (traditionalCharacters: string) => {
    // Handle pronouncing word
  },
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default SoundRecordingContext;
