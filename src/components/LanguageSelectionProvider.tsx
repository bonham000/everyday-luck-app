import React from "react";

import AppContext from "@src/AppContext";

/** ========================================================================
 * Types
 * =========================================================================
 */

type ComponentProp = (args: any) => JSX.Element;

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
      <AppContext.Consumer>
        {value => (
          <Component
            {...rest}
            openLanguageSelectionMenu={value.openLanguageSelectionMenu}
          />
        )}
      </AppContext.Consumer>
    );
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default LanguagesSelectionProvider;
