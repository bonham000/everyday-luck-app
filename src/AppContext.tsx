import React from "react";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
export type LanguageSelection = "Mandarin" | "Korean";

const AppContext = React.createContext({
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  openLanguageSelectionMenu: () => {
    // Handle opening menu
  },
  selectedLanguage: "Mandarin",
});

export default AppContext;
