import { AsyncStorage } from "react-native";

import { ASYNC_STORE_KEYS } from "@src/constants/AsyncStoreKeys";
import { APP_LANGUAGE_SETTING } from "@src/providers/GlobalStateContext";
import { User } from "@src/tools/types";

/** ========================================================================
 * User authentication for local session
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

/** ========================================================================
 * App Language Setting
 *
 * - TODO: Move this data to the user object on the sever.
 * =========================================================================
 */

export const getAppLanguageSetting = async () => {
  try {
    const raw = await AsyncStorage.getItem(
      ASYNC_STORE_KEYS.APP_LANGUAGE_SETTING_KEY,
    );

    const result = JSON.parse(raw);
    if (!result) {
      setAppLanguageSetting(APP_LANGUAGE_SETTING.SIMPLIFIED);
      return APP_LANGUAGE_SETTING.SIMPLIFIED;
    } else {
      return result;
    }
  } catch (err) {
    return APP_LANGUAGE_SETTING.SIMPLIFIED;
  }
};

export const setAppLanguageSetting = async (setting: APP_LANGUAGE_SETTING) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.APP_LANGUAGE_SETTING_KEY,
      JSON.stringify(setting),
    );
  } catch (err) {
    return;
  }
};
