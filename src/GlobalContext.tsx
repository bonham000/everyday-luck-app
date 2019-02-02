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
  experience: 0,
  selectedLanguage: "Mandarin",
  userScoreStatus: [] as ScoreStatus,
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  handleResetScores: () => {
    // Handle resetting scores
  },
  openLanguageSelectionMenu: () => {
    // Handle opening menu
  },
  setLessonScore: (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
    exp: number,
  ) => {
    // Handle setting lesson score
  },
});

export default AppContext;
