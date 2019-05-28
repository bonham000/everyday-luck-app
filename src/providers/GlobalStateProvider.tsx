import React, { ComponentType } from "react";

import GlobalStateContext, {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
  WordDictionary,
} from "@src/providers/GlobalStateContext";
import { GoogleSigninUser, HSKListSet, User } from "@src/tools/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

export interface GlobalStateValues {
  user?: User;
  lessons: HSKListSet;
  networkConnected: boolean;
  updateAvailable: boolean;
  wordDictionary: WordDictionary;
}

export interface AdditionalProviderProps {
  experience: number;
  userScoreStatus: ScoreStatus;
  languageSetting: APP_LANGUAGE_SETTING;
  appDifficultySetting: APP_DIFFICULTY_SETTING;
}

export interface GlobalStateContextProps
  extends GlobalStateValues,
    AdditionalProviderProps {
  setToastMessage: (toastMessage: string) => void;
  handleUpdateApp: () => void;
  handleResetScores: () => void;
  handleSwitchLanguage: () => void;
  openLanguageSelectionMenu: () => void;
  onSignin: (user: GoogleSigninUser) => Promise<void>;
  setLessonScore: (updatedScoreStatus: ScoreStatus, exp: number) => void;
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
      <GlobalStateContext.Consumer>
        {value => <Component {...rest} {...value} />}
      </GlobalStateContext.Consumer>
    );
  }
}

const withGlobalStateContext = (component: ComponentType<any>) => {
  return (props: any) => (
    <GlobalStateProvider {...props} Component={component} />
  );
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export { withGlobalStateContext };

export default GlobalStateProvider;
