import { DefaultTheme } from "react-native-paper";

/** ========================================================================
 * Color constants
 * =========================================================================
 */

const COLORS = {
  lightWhite: "rgb(231, 237, 240)",
  lightDark: "rgba(45,45,45,0.05)",
  darkText: "rgb(45,45,45)",
  fadedText: "rgb(60,60,60)",
  inactive: "rgb(125,125,125)",
  lightWhiteText: "rgb(215,215,215)",
  primaryRed: "rgb(190,8,20)",
  primaryBlue: "#3498db",
  actionButtonPink: "#f76d5e",
  actionButtonRed: "rgba(231,76,60,1)",
  actionButtonPurple: "#9b59b6",
  actionButtonBlue: "#3498db",
  actionButtonMint: "#1abc9c",
  actionButtonYellow: "#FFAB85",
  wordCardBorder: "rgba(25,25,25,0.5)",
  line: "rgba(25,25,25,0.85)",
  lineLight: "rgba(1,1,1,0.5)",
  lessonBlock: "#3498db",
  lessonBlockGrammarCustom: "#30e4ff",
  lessonBlockGrammar: "#5289ff",
  lessonBlockInProgress: "#6fc3fc",
  lessonContemporaryChinese: "#ffa570",
  lessonFarEast: "#ffe15c",
  lessonFrequencyList: "#ff7ac3",
  lessonCustomList: "#c380ff",
  lessonBookmarkedList: "#7c51fc",
  lockedLessonBlock: "rgb(215,215,215)",
  dark: "rgb(15,15,15)",
  white: "rgb(250,250,250)",
  textDarkTheme: "rgb(230,230,230)",
  lessonBlockDefault: "rgb(225,225,225)",
  lessonBlockDarkInactive: "rgb(32,32,32)",
  lessonBlockLightInactive: "rgb(205,205,205)",
  choiceBlockDefault: "rgb(55,55,55)",
  textInputDarkTheme: "rgb(35,35,35)",
  textInputLightTheme: "rgb(231, 237, 240)",
  choiceBlockDarkTheme: "rgb(38,38,38)",
  choiceBlockTextDarkTheme: "rgb(245,245,245)",
  listenBlockDefault: "rgb(85,85,85)",

  background: "rgb(231, 237, 240)",
  backgroundDark: "rgb(22,22,22)",
  backgroundDarkSecondary: "rgb(15,15,15)",

  flashcardDarkTheme: "rgb(35,35,35)",
  flashcardLightTheme: "rgb(225,225,225)",
};

export const setFontColor = (theme: string) =>
  theme === "dark" ? COLORS.white : COLORS.darkText;

/** ========================================================================
 * React Native Paper Theme Configuration
 * =========================================================================
 */

const APP_THEME = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primaryBlue,
    accent: COLORS.primaryRed,
  },
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export { COLORS, APP_THEME };
