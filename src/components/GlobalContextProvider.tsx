import React from "react";

import { LessonSummaryType } from "@src/content/types";
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
  experience: number;
  setToastMessage: (toastMessage: string) => void;
  openLanguageSelectionMenu: () => void;
  handleResetScores: () => void;
  setLessonScore: (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
    lessonType: LessonSummaryType,
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
            experience={value.experience}
            setToastMessage={value.setToastMessage}
            setLessonScore={value.setLessonScore}
            userScoreStatus={value.userScoreStatus}
            handleResetScores={value.handleResetScores}
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
