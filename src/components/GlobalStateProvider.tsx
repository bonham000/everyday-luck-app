import React, { ComponentType } from "react";

import GlobalState, {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  LessonScoreType,
  ScoreStatus,
  WordDictionary,
} from "@src/GlobalState";
import { GoogleSigninUser } from "@src/tools/store";
import { HSKListSet } from "@src/tools/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

export type ComponentProp = (args: any) => JSX.Element;

export interface GlobalStateValues {
  user?: GoogleSigninUser;
  lessons: HSKListSet;
  userScoreStatus: ScoreStatus;
  experience: number;
  wordDictionary: WordDictionary;
  languageSetting: APP_LANGUAGE_SETTING;
  appDifficultySetting: APP_DIFFICULTY_SETTING;
}

export interface GlobalStateProps extends GlobalStateValues {
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
  handleUpdateAppDifficultySetting: (
    setting: APP_DIFFICULTY_SETTING,
  ) => Promise<void>;
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
        {value => <Component {...rest} {...value} />}
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
