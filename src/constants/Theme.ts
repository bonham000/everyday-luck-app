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
  primaryRed: "rgb(200,8,20)",
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
  lessonBlockInProgress: "#6fc3fc",
  lessonCustom: "#FFAB85",
  lockedLessonBlock: "rgb(215,215,215)",
  dark: "rgb(15,15,15)",
  white: "rgb(250,250,250)",
  lessonBlockDefault: "rgb(225,225,225)",

  /**
   * Background
   */
  background: "rgb(231, 237, 240)",
};

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
