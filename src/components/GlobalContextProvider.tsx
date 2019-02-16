import React from "react";

import { getUser, User } from "@src/content/store";
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
  user: User;
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
  constructor(props: IProps) {
    super(props);

    this.state = {
      user: undefined,
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      user: await getUser(),
    });
  }

  render(): JSX.Element | null {
    const { Component, ...rest } = this.props;
    if (!this.state.user) {
      return null;
    }

    return (
      <GlobalContext.Consumer>
        {value => (
          <Component
            {...rest}
            user={this.state.user}
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
