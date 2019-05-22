import { Audio } from "expo";
import React, { ComponentType } from "react";
import { Platform } from "react-native";

import SoundRecordingContext from "@src/SoundRecordingState";
import { audioRecordingsClass } from "@src/tools/audio-dictionary";
import { AudioItem, Lesson, OptionType, Word } from "@src/tools/types";
import { getAudioFileUrl, randomInRange } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

export interface SoundRecordingProps {
  playbackError: boolean;
  loadingSoundData: boolean;
  pronounceWord: (traditionalCharacters: string) => Promise<void>;
  prefetchLessonSoundData: (lesson: Lesson) => Promise<void>;
}

interface IProps {
  Component: ComponentType<any>;
}

interface IState {
  playbackError: boolean;
  loadingSoundData: boolean;
  currentSoundAudio?: ReadonlyArray<Audio.Sound>;
  wordAudioMap: { [key: string]: ReadonlyArray<Audio.Sound> };
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class SoundRecordingComponent extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      wordAudioMap: {},
      playbackError: false,
      loadingSoundData: false,
    };
  }

  render(): JSX.Element | null {
    return (
      <SoundRecordingContext.Provider
        value={{
          playbackError: this.state.playbackError,
          loadingSoundData: this.state.loadingSoundData,
          pronounceWord: this.pronounceWord,
          prefetchLessonSoundData: this.prefetchLessonSoundData,
        }}
      >
        {this.props.children}
      </SoundRecordingContext.Provider>
    );
  }

  pronounceWord = async (traditionalCharacters: string) => {
    if (Platform.OS === "android") {
      this.fetchAndPlaySoundFileAndroid(traditionalCharacters);
    } else {
      const soundFiles = this.state.wordAudioMap[traditionalCharacters];
      const randomIdx = randomInRange(0, soundFiles.length);
      const soundFile = soundFiles[randomIdx];
      this.handlePronounceWord(soundFile);
    }
  };

  fetchAndPlaySoundFileAndroid = async (word: string) => {
    const soundData = audioRecordingsClass.getAudioRecordingsForWord(word);
    switch (soundData.type) {
      case OptionType.OK:
        const soundFileAndroid = await this.fetchSoundFileAndroid(
          soundData.data,
        );

        if (soundFileAndroid !== null) {
          return this.handlePronounceWord(soundFileAndroid);
        } else {
          return this.setState({ playbackError: true });
        }

      case OptionType.EMPTY:
        console.log("No sound file uri found!!!");
        return this.setState({ playbackError: true });
    }
  };

  fetchSoundFileAndroid = async (soundData: ReadonlyArray<AudioItem>) => {
    const audioIndex = randomInRange(0, soundData.length);
    const filePath = soundData[audioIndex].filePath;
    if (filePath) {
      const soundObject = new Audio.Sound();
      const uri = getAudioFileUrl(filePath);
      await soundObject.loadAsync({ uri });
      return soundObject;
    } else {
      return null;
    }
  };

  handlePronounceWord = async (soundData: Audio.Sound) => {
    if (soundData) {
      try {
        await soundData.playAsync();
      } catch (err) {
        await soundData.replayAsync({
          positionMillis: 0,
        });
      }
    }

    if (Platform.OS === "android") {
      if (soundData) {
        await soundData.unloadAsync();
      }
    }
  };

  prefetchLessonSoundData = async (lesson: Lesson) => {
    if (Platform.OS === "android") {
      return console.log(
        "Pre-fetching audio files is not supported for Android.",
      );
    }

    const words = lesson
      .map((word: Word) => {
        return word.traditional;
      })
      .filter(word => {
        return !(word in this.state.wordAudioMap);
      });

    const wordAudioMap = (await Promise.all(
      words.map(async (word: string) => {
        const soundData = audioRecordingsClass.getAudioRecordingsForWord(word);
        if (soundData.type === OptionType.OK) {
          const sounds = await this.fetchSoundFilesForWord(soundData.data);
          return { word, soundObjects: sounds };
        } else {
          return null;
        }
      }),
    ))
      .filter(Boolean)
      .reduce((map, recordingData) => {
        if (recordingData) {
          const { word, soundObjects } = recordingData;
          return {
            ...map,
            [word]: soundObjects,
          };
        } else {
          return map;
        }
      }, {});

    this.setState(prevState => ({
      wordAudioMap: {
        ...prevState.wordAudioMap,
        ...wordAudioMap,
      },
    }));
  };

  fetchSoundFilesForWord = async (
    soundData: ReadonlyArray<AudioItem>,
  ): Promise<ReadonlyArray<Audio.Sound>> => {
    const result = await Promise.all(
      soundData
        .map(async audioItem => {
          const soundObject = new Audio.Sound();
          const filePath = audioItem.filePath;
          if (filePath) {
            const uri = getAudioFileUrl(filePath);
            await soundObject.loadAsync({ uri });
            return soundObject;
          } else {
            return null;
          }
        })
        .filter(Boolean),
    );
    return result as ReadonlyArray<Audio.Sound>;
  };
}

// tslint:disable-next-line
class SoundRecordingProvider extends React.Component<IProps, IState> {
  render(): JSX.Element | null {
    const { Component, ...rest } = this.props;
    return (
      <SoundRecordingContext.Consumer>
        {value => <Component {...rest} {...value} />}
      </SoundRecordingContext.Consumer>
    );
  }
}

const withSoundRecordingProvider = (component: ComponentType<any>) => {
  return (props: any) => (
    <SoundRecordingProvider {...props} Component={component} />
  );
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export { withSoundRecordingProvider };

export default SoundRecordingComponent;
