import React from "react";
import {
  DefaultTheme,
  Provider as ReactNativePaperProvider,
} from "react-native-paper";
import { useScreens } from "react-native-screens";
import Sentry from "sentry-expo";

import App from "@src/AppContainer";
import { COLORS } from "@src/constants/Colors";

useScreens();

Sentry.config(String(process.env.SENTRY_DSN)).install();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primaryBlue,
    accent: COLORS.primaryRed,
  },
};

/** ========================================================================
 * Mandarin App
 * =========================================================================
 */

export default class extends React.Component {
  render(): JSX.Element {
    return (
      <ReactNativePaperProvider theme={theme}>
        <App />
      </ReactNativePaperProvider>
    );
  }
}
