import React from "react";
import { getLessonSet } from "./content";

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

export const initialLessonScoreState: ScoreStatus = getLessonSet(
  "Mandarin",
).map(() => ({
  mc: false,
  q: false,
}));

const AppContext = React.createContext({
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  openLanguageSelectionMenu: () => {
    // Handle opening menu
  },
  selectedLanguage: "Mandarin",
  userScoreStatus: initialLessonScoreState,
  setLessonScore: (lessonIndex: number, lessonPassedType: LessonScoreType) => {
    // Handle setting lesson score
  },
});

export default AppContext;
