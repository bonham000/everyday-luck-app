import React from "react";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
const AppToastContext = React.createContext({
  setToastMessage: (toastMessage: string) => {
    return;
  },
});

export default AppToastContext;
