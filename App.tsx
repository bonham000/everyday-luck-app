import React from "react";
import { LogBox } from "react-native";
import { Provider as ReactNativePaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";

import AppContainer from "@src/AppContainer";
import { APP_THEME } from "@src/constants/Theme";

/** ========================================================================
 * Config
 * =========================================================================
 */

/* Enable react-native-screens */
enableScreens();

/* Workaround for an issue with screen navigation */
import "react-native-gesture-handler";

/* Disable warnings */
LogBox.ignoreAllLogs(true);

/** ========================================================================
 * Mandarin App
 * =========================================================================
 */

export default class extends React.Component {
  render(): JSX.Element {
    return (
      <ReactNativePaperProvider theme={APP_THEME}>
        <AppContainer />
      </ReactNativePaperProvider>
    );
  }
}
