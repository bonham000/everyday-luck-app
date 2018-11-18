import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import NotesApp from "./src/ParentContainer";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(227,83,89)",
    accent: "#3498db",
    // accent: "#f1c40f",
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
