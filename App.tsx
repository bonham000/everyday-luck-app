import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { PRIMARY_BLUE, PRIMARY_RED } from "./src/Colors";
import NotesApp from "./src/ParentContainer";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_BLUE,
    accent: PRIMARY_RED,
  },
};

export default class App extends React.Component {
  render(): JSX.Element {
    return (
      <PaperProvider theme={theme}>
        <NotesApp />
      </PaperProvider>
    );
  }
}
