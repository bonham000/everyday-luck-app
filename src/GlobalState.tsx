import React from "react";

import { GoogleSigninUser } from "@src/api/store";
import { LessonSet } from "@src/api/types";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
export interface ScoreStatus {
  mc_english: boolean;
  mc_mandarin: boolean;
  quiz_text: boolean;
  final_completed_lesson_index: number;
}

export enum APP_LANGUAGE_SETTING {
  SIMPLIFIED = "SIMPLIFIED",
  TRADITIONAL = "TRADITIONAL",
}

export type LessonScoreType = "mc_english" | "mc_mandarin" | "quiz_text";

const GlobalState = React.createContext({
  experience: 0,
  user: {},
  lessons: [] as LessonSet,
  userScoreStatus: {},
  languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
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
  handleSwitchLanguage: () => {
    // Handle switching app language setting
  },
  onSignin: (user: GoogleSigninUser) => {
    // Handle action on signin
  },
});

export default GlobalState;
