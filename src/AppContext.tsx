import React from "react";

import { Word } from "@src/content/Mandarin";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
const AppContext = React.createContext({
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  openLanguageSelectionMenu: () => {
    // Handle opening menu
  },
  selectedLanguage: [] as ReadonlyArray<Word>,
});

export default AppContext;
