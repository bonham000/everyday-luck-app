import React from "react";

import { GoogleSigninUser, HSKListSet, Word } from "@src/tools/types";

/** ========================================================================
 * Types and Config
 * =========================================================================
 */

export interface ListScore {
  list_key: string;
  list_index: number;
  complete: boolean;
  number_words_completed: number;
}

export interface ScoreStatus {
  mc_english: boolean;
  mc_mandarin: boolean;
  quiz_text: boolean;
  mandarin_pronunciation: boolean;
  list_02_score: ListScore;
  list_03_score: ListScore;
  list_04_score: ListScore;
  list_05_score: ListScore;
  list_06_score: ListScore;
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

/**
 * Default the opt-out level to HARD. You've gotta be good to opt out!
 */
export const OPT_OUT_LEVEL = APP_DIFFICULTY_SETTING.HARD;

/**
 * Lesson Quiz Sizes based on the app difficulty
 */
export const DIFFICULTY_TO_LESSON_SIZE_MAP = {
  [APP_DIFFICULTY_SETTING.EASY]: 10,
  [APP_DIFFICULTY_SETTING.MEDIUM]: 20,
  [APP_DIFFICULTY_SETTING.HARD]: 30,
};

export enum QUIZ_TYPE {
  ENGLISH = "mc_english",
  MANDARIN = "mc_mandarin",
  QUIZ_TEXT = "quiz_text",
  PRONUNCIATION = "mandarin_pronunciation",
}

export const QuizTypeOptions: ReadonlyArray<QUIZ_TYPE> = [
  QUIZ_TYPE.QUIZ_TEXT,
  QUIZ_TYPE.ENGLISH,
  QUIZ_TYPE.MANDARIN,
  QUIZ_TYPE.PRONUNCIATION,
];

export interface ToastMessageArgs {
  message: string;
  timeout?: number;
  shouldNotExpire?: boolean;
}

/** ========================================================================
 * Global State Context
 * =========================================================================
 */

const GlobalStateContext = React.createContext({
  experience: 0,
  lessons: [] as HSKListSet,
  userScoreStatus: {},
  wordDictionary: {},
  networkConnected: false,
  updateAvailable: false,
  appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
  languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  setToastMessage: (toastMessage: string | ToastMessageArgs) => {
    // Handle setting Toast message
  },
  handleUpdateApp: () => {
    // Handle resetting scores
  },
  handleResetScores: () => {
    // Handle resetting scores
  },
  setLessonScore: (updatedScoreStatus: ScoreStatus, exp: number) => {
    // Handle setting lesson score
  },
  handleUpdateAppDifficultySetting: (setting: APP_DIFFICULTY_SETTING) => {
    // Handle switching app difficulty setting
  },
  handleSwitchLanguage: () => {
    // Handle switching app language setting
  },
  onSignin: (user: GoogleSigninUser) => {
    // Handle action on signin
  },
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default GlobalStateContext;
