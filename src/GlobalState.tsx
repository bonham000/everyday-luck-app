import React from "react";

import { GoogleSigninUser } from "@src/tools/store";
import { AudioItem, HSKListSet, Lesson, Word } from "@src/tools/types";
import { Audio } from "expo";

/** ========================================================================
 * Context for toast message
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

export enum QUIZ_TYPE {
  ENGLISH = "mc_english",
  MANDARIN = "mc_mandarin",
  QUIZ_TEXT = "quiz_text",
  PRONUNCIATION = "mandarin_pronunciation",
}

export const QuizTypeOptions: ReadonlyArray<QUIZ_TYPE> = [
  QUIZ_TYPE.ENGLISH,
  QUIZ_TYPE.MANDARIN,
  QUIZ_TYPE.QUIZ_TEXT,
  QUIZ_TYPE.PRONUNCIATION,
];

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
  getSoundFileForWord: (traditionalCharacters: string) => {
    // Return sound file for given word
  },
  prefetchLessonSoundData: async (lesson: Lesson) => {
    // Handle pre-fetching sound data for lesson
  },
  fetchSoundFilesForWord: async (
    soundData: ReadonlyArray<AudioItem>,
  ): Promise<ReadonlyArray<Audio.Sound>> => {
    // Handle fetching sound file for word
    return [];
  },
});

export default GlobalState;
