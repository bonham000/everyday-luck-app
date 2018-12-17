import React from "react";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
const AppToastContext = React.createContext({
  setToastMessage: (toastMessage: string) => {
    // Handle setting Toast message
  },
  openLanguageSelectionMenu: () => {
    // Handle opening menu
  },
});

export default AppToastContext;
