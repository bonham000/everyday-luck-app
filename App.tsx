import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import NotesApp from "./src/ParentContainer";

export const PRIMARY_RED = "rgb(200,8,20)";
export const PRIMARY_BLUE = "#3498db";

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
