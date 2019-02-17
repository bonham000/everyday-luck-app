import { AsyncStorage } from "react-native";

/** ========================================================================
 * User authentication for local session
 * =========================================================================
 */

const USER_KEY = "USER_KEY";

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
    const result = await AsyncStorage.getItem(USER_KEY);
    return JSON.parse(result);
  } catch (err) {
    return;
  }
};

export const saveLocalUser = async (user: GoogleSigninUser) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    return;
  }
};

export const logoutLocalUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (err) {
    return;
  }
};
