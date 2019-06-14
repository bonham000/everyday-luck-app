import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

/** ========================================================================
 * Push Notification Utils
 * =========================================================================
 */

/**
 * Get the push notification token for the device.
 */
const registerForPushNotificationsAsync = async (): Promise<string> => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS,
    );

    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return "";
    }

    // Get the token that uniquely identifies this device
    const token = await Notifications.getExpoPushTokenAsync();

    return token;
  } catch (err) {
    return "";
  }
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export { registerForPushNotificationsAsync };
