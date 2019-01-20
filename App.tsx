import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Sentry from "sentry-expo";

import App from "@src/AppContainer";
import { COLORS } from "@src/styles/Colors";

// @ts-ignore
Sentry.config(process.env.SENTRY_DSN);

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primaryBlue,
    accent: COLORS.primaryRed,
  },
};

export default class extends React.Component {
  render(): JSX.Element {
    return (
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    );
  }
}
