import React from "react";
import { Provider as ReactNativePaperProvider } from "react-native-paper";
// import { useScreens } from "react-native-screens";
import Sentry from "sentry-expo";

import App from "@src/AppContainer";
import { APP_THEME } from "@src/constants/Theme";

/** ========================================================================
 * Config
 * =========================================================================
 */

/* Enable react-native-screens */
// useScreens();

/* Workaround for an issue with screen navigation */
import "react-native-gesture-handler";

/* Configure Sentry */
Sentry.config(String(process.env.SENTRY_DSN)).install();

/* Disable warnings */
// tslint:disable-next-line
console.disableYellowBox = true;

/** ========================================================================
 * Mandarin App
 * =========================================================================
 */

export default class extends React.Component {
  render(): JSX.Element {
    return (
      <ReactNativePaperProvider theme={APP_THEME}>
        <App />
      </ReactNativePaperProvider>
    );
  }
}
