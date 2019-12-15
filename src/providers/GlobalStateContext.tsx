import React from "react";

import EVENTS from "@src/constants/AnalyticsEvents";
import { ListScoreSet } from "@src/lessons";
import { HSKListSet, Word } from "@src/tools/types";

/** ========================================================================
 * Types and Config
 * =========================================================================
 */

export interface UserSettings {
  disable_audio: boolean;
  auto_proceed_question: boolean;
  language_setting: APP_LANGUAGE_SETTING;
  app_difficulty_setting: APP_DIFFICULTY_SETTING;
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

const GlobalStateContextValues = {
  experience: 0,
  lessons: [] as HSKListSet,
  userScoreStatus: {},
  wordDictionary: {},
  updateAvailable: false,
  disableAudio: false,
  autoProceedQuestion: false,
  appDifficultySetting: APP_DIFFICULTY_SETTING.MEDIUM,
  languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  setToastMessage: (toastMessage: string | ToastMessageArgs) => {
    /* Handle setting Toast message */
    return;
  },
  handleUpdateApp: () => {
    /* Handle resetting scores */
    return;
  },
  handleResetScores: () => {
    /* Handle resetting scores */
    return;
  },
  copyToClipboard: (text: string) => {
    /* Handle copy to clipboard */
    return;
  },
  setLessonScore: (
    updatedScoreStatus: ListScoreSet,
    exp: number,
  ): Promise<void> => {
    /* Handle setting lesson score */
    return Promise.resolve();
  },
  updateExperiencePoints: (experiencePoints: number) => {
    /* Handle updating experience points */
    return;
  },
  handleSwitchLanguage: () => {
    /* Handle switching app language setting */
    return;
  },
  handleUpdateUserSettingsField: (
    data: Partial<UserSettings>,
    optionalSuccessCallback?: (args?: any) => any,
  ) => {
    /* Handle updating user settings */
    return;
  },
  logAnalyticsEvent: (event: EVENTS) => {
    /* Handle logging event */
    return;
  },
  handleSendContactEmail: (
    contactEmail: string,
    message: string,
    successCallback?: () => void,
  ) => {
    /* Handle sending email */
    return;
  },
};

const GlobalStateContext = React.createContext(GlobalStateContextValues);

/** ========================================================================
 * Export
 * =========================================================================
 */

export { GlobalStateContextValues };

export default GlobalStateContext;
