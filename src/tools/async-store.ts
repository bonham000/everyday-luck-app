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
    return JSON.parse(result);
  } catch (err) {
    return;
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
