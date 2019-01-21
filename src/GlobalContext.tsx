import React from "react";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
export type LanguageSelection = "Mandarin" | "Korean";

interface LessonScore {
  mc: boolean;
  q: boolean;
}

export type LessonScoreType = "mc" | "q";

export type ScoreStatus = ReadonlyArray<LessonScore>;

const AppContext = React.createContext({
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  handleResetScores: () => {
    // Handle resetting scores
  },
  openLanguageSelectionMenu: () => {
    // Handle opening menu
  },
  selectedLanguage: "Mandarin",
  userScoreStatus: [] as ScoreStatus,
  setLessonScore: (lessonIndex: number, lessonPassedType: LessonScoreType) => {
    // Handle setting lesson score
  },
});

export default AppContext;
