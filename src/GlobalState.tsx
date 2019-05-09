import React from "react";

import { GoogleSigninUser } from "@src/api/store";
import { LessonSet } from "./api/types";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
interface LessonScore {
  mc: boolean;
  q: boolean;
}

export type LessonScoreType = "mc" | "q";

export type ScoreStatus = ReadonlyArray<LessonScore>;

const GlobalState = React.createContext({
  experience: 0,
  user: {},
  lessons: [] as LessonSet,
  userScoreStatus: [] as ScoreStatus,
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  handleResetScores: () => {
    // Handle resetting scores
  },
  setLessonScore: (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
    exp: number,
  ) => {
    // Handle setting lesson score
  },
  onSignin: (user: GoogleSigninUser) => {
    // Handle action on signin
  },
});

export default GlobalState;
