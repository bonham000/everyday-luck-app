import React from "react";

import { GoogleSigninUser } from "@src/tools/store";
import { HSKListSet, Word } from "@src/tools/types";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
export interface ScoreStatus {
  mc_english: boolean;
  mc_mandarin: boolean;
  quiz_text: boolean;
  mandarin_pronunciation: boolean;
  final_completed_lesson_index: number;
}

export interface WordDictionary {
  [key: string]: Word;
}

export enum APP_LANGUAGE_SETTING {
  SIMPLIFIED = "simplified",
  TRADITIONAL = "traditional",
}

export enum APP_DIFFICULTY_SETTING {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export type LessonScoreType =
  | "mc_english"
  | "mc_mandarin"
  | "quiz_text"
  | "mandarin_pronunciation";

const GlobalState = React.createContext({
  experience: 0,
  user: {},
  lessons: [] as HSKListSet,
  userScoreStatus: {},
  wordDictionary: {},
  appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
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
  handleUpdateAppDifficultySetting: (setting: APP_DIFFICULTY_SETTING) => {
    // Handle switching app difficulty setting
  },
  handleSwitchLanguage: (callback: () => void) => {
    // Handle switching app language setting
  },
  onSignin: (user: GoogleSigninUser) => {
    // Handle action on signin
  },
});

export default GlobalState;
