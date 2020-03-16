import * as Speech from "expo-speech";
import React, { ComponentType } from "react";

import SoundRecordingContext from "@src/providers/SoundRecordingContext";

/** ========================================================================
 * Types
 * =========================================================================
 */

export interface SoundRecordingProps {
  playbackError: boolean;
  handlePronounceWord: (traditionalCharacters: string) => Promise<void>;
}

interface IProps {
  disableAudio: boolean;
}

interface IState {
  playbackError: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class SoundRecordingProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      playbackError: false,
    };
  }

  render(): JSX.Element | null {
    return (
      <SoundRecordingContext.Provider
        value={{
          playbackError: this.state.playbackError,
          handlePronounceWord: this.handlePronounceWord,
        }}
      >
        {this.props.children}
      </SoundRecordingContext.Provider>
    );
  }

  handlePronounceWord = async (traditionalCharacters: string) => {
    if (!this.props.disableAudio) {
      try {
        this.setState({ playbackError: false }, () => {
          Speech.speak(traditionalCharacters, { language: "zh" });
        });
      } catch (err) {
        this.setState({ playbackError: true });
      }
    }
  };
}

/** ========================================================================
 * Provider Component
 * =========================================================================
 */

const withSoundRecordingContext = (component: ComponentType<any>) => {
  return (props: any) => {
    const Component = component;
    return (
      <SoundRecordingContext.Consumer>
        {value => <Component {...props} {...value} />}
      </SoundRecordingContext.Consumer>
    );
  };
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export { withSoundRecordingContext };

export default SoundRecordingProvider;
