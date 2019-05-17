import React, { ComponentType } from "react";

import GlobalState, {
  APP_LANGUAGE_SETTING,
  LessonScoreType,
  ScoreStatus,
} from "@src/GlobalState";
import { GoogleSigninUser } from "@src/tools/store";
import { LessonSet } from "@src/tools/types";

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
  languageSetting: APP_LANGUAGE_SETTING;
  setToastMessage: (toastMessage: string) => void;
  openLanguageSelectionMenu: () => void;
  handleResetScores: () => void;
  setLessonScore: (
    lessonIndex: number,
    lessonPassedType: LessonScoreType,
    exp: number,
  ) => void;
  handleSwitchLanguage: (callback: () => void) => void;
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
            languageSetting={value.languageSetting}
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
