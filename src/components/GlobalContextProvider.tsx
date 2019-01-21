import React from "react";

import GlobalContext, {
  LanguageSelection,
  LessonScoreType,
  ScoreStatus,
} from "@src/GlobalContext";

/** ========================================================================
 * Types
 * =========================================================================
 */

export type ComponentProp = (args: any) => JSX.Element;

export interface GlobalContextProps {
  selectedLanguage: LanguageSelection;
  userScoreStatus: ScoreStatus;
  setToastMessage: (toastMessage: string) => void;
  openLanguageSelectionMenu: () => void;
  setLessonScore: (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
  ) => void;
}

interface IProps {
  Component: ComponentProp;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class GlobalContextProvider extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { Component, ...rest } = this.props;
    return (
      <GlobalContext.Consumer>
        {value => (
          <Component
            {...rest}
            setToastMessage={value.setToastMessage}
            setLessonScore={value.setLessonScore}
            userScoreStatus={value.userScoreStatus}
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

export default GlobalContextProvider;
