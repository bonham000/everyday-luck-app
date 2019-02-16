import React from "react";

import { User } from "@src/content/store";
import { LessonSet } from "@src/content/types";
import GlobalState, {
  LanguageSelection,
  LessonScoreType,
  ScoreStatus,
} from "@src/GlobalState";

/** ========================================================================
 * Types
 * =========================================================================
 */

export type ComponentProp = (args: any) => JSX.Element;

export interface GlobalStateProps {
  user?: User;
  lessons: LessonSet;
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

class GlobalStateProvider extends React.Component<IProps, IState> {
  render(): JSX.Element | null {
    const { Component, ...rest } = this.props;

    return (
      <GlobalState.Consumer>
        {value => (
          <Component
            {...rest}
            user={value.user}
            lessons={value.lessons}
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
      </GlobalState.Consumer>
    );
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default GlobalStateProvider;
