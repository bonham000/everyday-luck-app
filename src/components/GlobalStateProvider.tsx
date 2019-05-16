import React, { ComponentType } from "react";

import { GoogleSigninUser } from "@src/api/store";
import { LessonSet } from "@src/api/types";
import GlobalState, { LessonScoreType, ScoreStatus } from "@src/GlobalState";

/** ========================================================================
 * Types
 * =========================================================================
 */

export type ComponentProp = (args: any) => JSX.Element;

export interface GlobalStateProps {
  user?: GoogleSigninUser;
  lessons: LessonSet;
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
  handleSwitchLanguage: () => void;
  onSignin: (user: GoogleSigninUser) => Promise<void>;
}

interface IProps {
  Component: ComponentType<any>;
}

interface IState {
  user?: GoogleSigninUser;
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
            handleSwitchLanguage={value.handleSwitchLanguage}
          />
        )}
      </GlobalState.Consumer>
    );
  }
}

const withGlobalState = (component: ComponentType<any>) => {
  return (props: any) => (
    <GlobalStateProvider {...props} Component={component} />
  );
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export { withGlobalState };

export default GlobalStateProvider;
