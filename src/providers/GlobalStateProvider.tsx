import React, { ComponentType } from "react";

import GlobalStateContextValues, {
  APP_DIFFICULTY_SETTING,
  APP_LANGUAGE_SETTING,
  ScoreStatus,
  UserSettings,
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
  disableAudio: boolean;
  autoProceedQuestion: boolean;
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
  onSignin: (user: GoogleSigninUser) => Promise<void>;
  updateExperiencePoints: (experiencePoints: number) => void;
  setLessonScore: (updatedScoreStatus: ScoreStatus, exp: number) => void;
  handleUpdateAppDifficultySetting: (
    setting: APP_DIFFICULTY_SETTING,
  ) => Promise<void>;
  handleUpdateUserSettingsField: (
    data: Partial<UserSettings>,
    optionalSuccessCallback?: (args?: any) => any,
  ) => void;
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
      <GlobalStateContextValues.Consumer>
        {value => <Component {...rest} {...value} />}
      </GlobalStateContextValues.Consumer>
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
