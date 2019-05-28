import { AsyncStorage } from "react-native";

import { ASYNC_STORE_KEYS } from "@src/constants/AsyncStoreKeys";

/** ========================================================================
 * Async Storage Helper Methods
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
export const getOfflineRequestFlagState = async (): Promise<
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
export const setOfflineRequestFlagState = async (data: OfflineUpdatesFlag) => {
  try {
    await AsyncStorage.setItem(
      ASYNC_STORE_KEYS.OFFLINE_UPDATES_FLAG,
      JSON.stringify(data),
    );
  } catch (err) {
    return;
  }
};
