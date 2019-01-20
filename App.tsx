import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Sentry from "sentry-expo";

import { COLORS } from "@src/constants/Colors";
import App from "@src/RootContainer";

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

export default class extends React.Component {
  render(): JSX.Element {
    return (
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    );
  }
}
