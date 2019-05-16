import { APP_LANGUAGE_SETTING } from "@src/GlobalState";
import { AsyncStorage } from "react-native";

/** ========================================================================
 * Config
 * =========================================================================
 */

const STORE_KEYS = {
  USER_KEY: "USER_KEY",
  APP_LANGUAGE_SETTING_KEY: "APP_LANGUAGE_SETTING_KEY",
};

/** ========================================================================
 * User authentication for local session
 * =========================================================================
 */

export interface GoogleSigninUser {
  email?: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photoUrl?: string;
}

export const getLocalUser = async () => {
  try {
    const result = await AsyncStorage.getItem(STORE_KEYS.USER_KEY);
    return JSON.parse(result);
  } catch (err) {
    return;
  }
};

export const saveLocalUser = async (user: GoogleSigninUser) => {
  try {
    await AsyncStorage.setItem(STORE_KEYS.USER_KEY, JSON.stringify(user));
  } catch (err) {
    return;
  }
};

export const logoutLocalUser = async () => {
  try {
    await AsyncStorage.removeItem(STORE_KEYS.USER_KEY);
  } catch (err) {
    return;
  }
};

/** ========================================================================
 * App Language Setting
 * =========================================================================
 */

export const getAppLanguageSetting = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORE_KEYS.APP_LANGUAGE_SETTING_KEY);

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
      STORE_KEYS.APP_LANGUAGE_SETTING_KEY,
      JSON.stringify(setting),
    );
  } catch (err) {
    return;
  }
};
