import { DEFAULT_SCORE_STATE } from "@src/constants/Scores";
import {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
} from "@src/providers/GlobalStateContext";
import { GlobalStateContextProps } from "@src/providers/GlobalStateProvider";
import { SoundRecordingProps } from "@src/providers/SoundRecordingProvider";
import { GoogleSigninUser } from "@src/tools/store";
import { Lesson, LessonScreenParams, ListScreenParams } from "@src/tools/types";

/** ========================================================================
 * Global State
 * =========================================================================
 */

const GoogleUser = {
  email: "sean.smith.2009@gmail.com",
  familyName: "Smith",
  givenName: "Sean",
  id: "asdf7f98asd7f0s7ads0",
  name: "Seanie X",
};

export const MockGlobalStateProps: GlobalStateContextProps = {
  user: GoogleUser,
  lessons: [],
  userScoreStatus: DEFAULT_SCORE_STATE,
  experience: 54234,
  wordDictionary: {},
  languageSetting: APP_LANGUAGE_SETTING.SIMPLIFIED,
  appDifficultySetting: APP_DIFFICULTY_SETTING.EASY,
  setToastMessage: (toastMessage: string) => {
    return;
  },
  openLanguageSelectionMenu: () => {
    return;
  },
  handleResetScores: () => {
    return;
  },
  handleSwitchLanguage: () => {
    return;
  },
  onSignin: async (user: GoogleSigninUser) => {
    return;
  },
  setLessonScore: (updatedScoreStatus: ScoreStatus, exp: number) => {
    return;
  },
  handleUpdateAppDifficultySetting: async (setting: APP_DIFFICULTY_SETTING) => {
    return;
  },
};

/** ========================================================================
 * Sound Recording State
 * =========================================================================
 */

export const MockSoundRecordingProps: SoundRecordingProps = {
  playbackError: false,
  loadingSoundData: false,
  audioMetadataCache: {},
  prefetchLessonSoundData: async (lesson: Lesson) => {
    return;
  },
  handlePronounceWord: async (traditionalCharacters: string) => {
    return;
  },
};

/** ========================================================================
 * Navigation Params
 * =========================================================================
 */

export const MockListScreenParams: ListScreenParams = {
  listKey: "1-2",
  hskList: [],
  listIndex: 0,
  type: "LESSON",
};

export const MockLessonScreenParams: LessonScreenParams = {
  lesson: [],
  listIndex: 0,
  lessonIndex: 0,
  isFinalLesson: false,
  type: "LESSON",
  isFinalUnlockedLesson: false,
};
