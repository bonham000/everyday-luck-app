import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import App from "./src/AppContainer";
import { PRIMARY_BLUE, PRIMARY_RED } from "./src/Styles/Colors";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_BLUE,
    accent: PRIMARY_RED,
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
