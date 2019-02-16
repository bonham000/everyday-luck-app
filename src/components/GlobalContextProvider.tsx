import React from "react";

import { User } from "@src/content/store";
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
  user?: User;
  selectedLanguage: LanguageSelection;
  userScoreStatus: ScoreStatus;
  experience: number;
  setToastMessage: (toastMessage: string) => void;
  openLanguageSelectionMenu: () => void;
  handleResetScores: () => void;
  setLessonScore: (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
    exp: number,
  ) => void;
  onSignin: () => Promise<void>;
}

interface IProps {
  Component: ComponentProp;
}

interface IState {
  user?: User;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class GlobalContextProvider extends React.Component<IProps, IState> {
  render(): JSX.Element | null {
    const { Component, ...rest } = this.props;

    return (
      <GlobalContext.Consumer>
        {value => (
          <Component
            {...rest}
            user={value.user}
            onSignin={value.onSignin}
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
