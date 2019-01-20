import React from "react";

import GlobalContext from "@src/GlobalContext";

/** ========================================================================
 * Types
 * =========================================================================
 */

export type ComponentProp = (args: any) => JSX.Element;

interface IProps {
  Component: ComponentProp;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class LanguagesSelectionProvider extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { Component, ...rest } = this.props;
    return (
      <GlobalContext.Consumer>
        {value => (
          <Component
            {...rest}
            selectedLanguage={value.selectedLanguage}
            openLanguageSelectionMenu={value.openLanguageSelectionMenu}
          />
        )}
      </GlobalContext.Consumer>
    );
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default LanguagesSelectionProvider;
