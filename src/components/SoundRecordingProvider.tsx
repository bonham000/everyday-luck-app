import { Audio } from "expo";
import React, { ComponentType } from "react";
import { Platform } from "react-native";

import SoundRecordingState from "@src/SoundRecordingState";
import { audioRecordingsClass } from "@src/tools/audio-dictionary";
import { AudioItem, Lesson, OptionType, Word } from "@src/tools/types";
import { getAudioFileUrl } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

export interface SoundRecordingProps {
  getSoundFileForWord: (
    traditionalCharacters: string,
  ) => ReadonlyArray<Audio.Sound>;
  prefetchLessonSoundData: (lesson: Lesson) => Promise<void>;
  fetchSoundFilesForWord: (
    soundData: ReadonlyArray<AudioItem>,
  ) => Promise<ReadonlyArray<Audio.Sound>>;
}

interface IProps {
  Component: ComponentType<any>;
}

interface IState {
  wordAudioMap: { [key: string]: ReadonlyArray<Audio.Sound> };
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class SoundRecordingProvider extends React.Component<IProps, IState> {
  render(): JSX.Element | null {
    const { Component, ...rest } = this.props;

    return (
      <SoundRecordingState.Consumer>
        {value => <Component {...rest} {...value} />}
      </SoundRecordingState.Consumer>
    );
  }

  getSoundFileForWord = (traditionalCharacters: string) => {
    return this.state.wordAudioMap[traditionalCharacters];
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

export default SoundRecordingProvider;
