import React from "react";

/** ========================================================================
 * Context for toast message
 * =========================================================================
 */
export default React.createContext({
  setToastMessage: (toastMessage: string) => {
    return;
  },
});
