import React from "react";
import { Provider as ReactNativePaperProvider } from "react-native-paper";
import { useScreens } from "react-native-screens";
import Sentry from "sentry-expo";

import App from "@src/AppContainer";
import { APP_THEME } from "@src/constants/Theme";

useScreens();

Sentry.config(String(process.env.SENTRY_DSN)).install();

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
