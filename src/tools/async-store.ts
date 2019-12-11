import { AsyncStorage } from "react-native";

import { ASYNC_STORE_KEYS } from "@src/constants/AsyncStoreKeys";
import { User } from "@src/tools/types";

/** ========================================================================
 * Persistence of user to local async store
 * =========================================================================
 */

export const getPersistedUser = async (): Promise<User | undefined> => {
  try {
    const result = await AsyncStorage.getItem(ASYNC_STORE_KEYS.USER_KEY);
    return result ? JSON.parse(result) : undefined;
  } catch (err) {
    return undefined;
  }
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
