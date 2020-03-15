import { AsyncStorage } from "react-native";

import { ASYNC_STORE_KEYS } from "@src/constants/AsyncStoreKeys";
import { User, Word } from "@src/tools/types";
import MOCKS from "@tests/mocks";

/** ========================================================================
 * Persistence of user to local async store
 * =========================================================================
 */

export const getPersistedUser = async (): Promise<User | undefined> => {
  try {
    const result = await AsyncStorage.getItem(ASYNC_STORE_KEYS.USER_KEY);
    if (result) {
      const user: User = JSON.parse(result);

      /**
       * Add scores for new lessons if they have been added.
       */
      if (
        Object.keys(user.score_history).length !==
        Object.keys(MOCKS.DEFAULT_SCORE_STATE).length
      ) {
        // tslint:disable-next-line
        user.score_history = {
          ...MOCKS.DEFAULT_SCORE_STATE,
          ...user.score_history,
        };
      }

      return user;
    }
  } catch (err) {
    /* Do nothing */
  }

  return undefined;
};

export const saveUserToAsyncStorage = async (user: User) => {
  try {
    await AsyncStorage.setItem(ASYNC_STORE_KEYS.USER_KEY, JSON.stringify(user));
  } catch (err) {
    return;
  }
};

export const logoutUserLocal = async () => {
  try {
    await AsyncStorage.removeItem(ASYNC_STORE_KEYS.USER_KEY);
  } catch (err) {
    return;
  }
};

/** ========================================================================
 * Persistence of user app installation flag
 * =========================================================================
 */

export const getUserDocumentsAgreementsFlag = async (): Promise<boolean> => {
  try {
    const result = await AsyncStorage.getItem(
      ASYNC_STORE_KEYS.DOCUMENTS_AGREEMENT,
    );
    return result ? JSON.parse(result) : false;
  } catch (err) {
    return false;
  }
};

export const setUserDocumentsAgreementsFlag = async (agreement: boolean) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.DOCUMENTS_AGREEMENT,
      JSON.stringify(agreement),
    );
  } catch (err) {
    return;
  }
};

/** ========================================================================
 * Word Study List
 * =========================================================================
 */

export type WordStudyList = ReadonlyArray<string>;

export const getWordStudyList = async (): Promise<WordStudyList> => {
  try {
    const result = await AsyncStorage.getItem(ASYNC_STORE_KEYS.WORD_STUDY_LIST);
    return result ? JSON.parse(result) : [];
  } catch (err) {
    return [];
  }
};

export const setWordStudyList = async (wordList: WordStudyList) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.WORD_STUDY_LIST,
      JSON.stringify(wordList),
    );
  } catch (err) {
    return;
  }
};

/** ========================================================================
 * Custom Word List
 * =========================================================================
 */

export type CustomWordStudyList = ReadonlyArray<Word>;

export const getCustomWordStudyList = async (): Promise<
  CustomWordStudyList
> => {
  try {
    const result = await AsyncStorage.getItem(
      ASYNC_STORE_KEYS.CUSTOM_WORD_STUDY_LIST,
    );
    return result ? JSON.parse(result) : [];
  } catch (err) {
    return [];
  }
};

export const setCustomWordStudyList = async (wordList: CustomWordStudyList) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.CUSTOM_WORD_STUDY_LIST,
      JSON.stringify(wordList),
    );
  } catch (err) {
    return;
  }
};

/** ========================================================================
 * Offline Flag:
 * =========================================================================
 */

export interface OfflineUpdatesFlag {
  shouldProcessRequests: boolean;
}

const DEFAULT_FLAG_STATE = {
  shouldProcessRequests: false,
};

/**
 * Deserialize saved request queue if it exists.
 *
 * @returns `OfflineUpdatesFlag`
 */
export const getOfflineUpdatesFlagState = async (): Promise<
  OfflineUpdatesFlag
> => {
  try {
    const result = await AsyncStorage.getItem(
      ASYNC_STORE_KEYS.OFFLINE_UPDATES_FLAG,
    );
    const flag = JSON.parse(result);
    return flag || DEFAULT_FLAG_STATE;
  } catch (err) {
    return DEFAULT_FLAG_STATE;
  }
};

/**
 * Serialize the request queue and save to local AsyncStorage module.
 *
 * @param `OfflineUpdatesFlag`
 */
export const setOfflineUpdatesFlagState = async (data: OfflineUpdatesFlag) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.OFFLINE_UPDATES_FLAG,
      JSON.stringify(data),
    );
  } catch (err) {
    return;
  }
};
