import { Audio } from "expo";
import React, { ComponentType } from "react";
import { Platform } from "react-native";

import SoundRecordingContext, {
  AudioMetadata,
  AudioMetadataCache,
} from "@src/SoundRecordingState";
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
  audioMetadataCache: AudioMetadataCache;
  handlePronounceWord: (traditionalCharacters: string) => Promise<void>;
  prefetchLessonSoundData: (lesson: Lesson) => Promise<void>;
}

interface IProps {
  Component: ComponentType<any>;
}

interface IState {
  playbackError: boolean;
  loadingSoundData: boolean;
  audioMetadataCache: AudioMetadataCache;
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
      playbackError: false,
      loadingSoundData: false,
      wordAudioMap: {},
      audioMetadataCache: {},
    };
  }

  render(): JSX.Element | null {
    return (
      <SoundRecordingContext.Provider
        value={{
          handlePronounceWord: this.handlePronounceWord,
          playbackError: this.state.playbackError,
          loadingSoundData: this.state.loadingSoundData,
          audioMetadataCache: this.state.audioMetadataCache,
          prefetchLessonSoundData: this.prefetchLessonSoundData,
        }}
      >
        {this.props.children}
      </SoundRecordingContext.Provider>
    );
  }

  handlePronounceWord = async (traditionalCharacters: string) => {
    this.setState(
      updateAudioMetadataCache(traditionalCharacters, {
        loading: true,
        playbackError: false,
      }),
      async () => {
        try {
          if (Platform.OS === "android") {
            await this.fetchAndPlaySoundFileAndroid(traditionalCharacters);
          } else {
            await this.fetchAndPlayWordiOS(traditionalCharacters);
          }

          return this.setState(
            updateAudioMetadataCache(traditionalCharacters, {
              loading: false,
              playbackError: false,
            }),
          );
        } catch (err) {
          return this.setState(
            updateAudioMetadataCache(traditionalCharacters, {
              loading: false,
              playbackError: true,
            }),
          );
        }
      },
    );
  };

  /** **********************************************************************
   * Android:
   */

  fetchAndPlaySoundFileAndroid = async (word: string) => {
    const soundData = audioRecordingsClass.getAudioRecordingsForWord(word);
    switch (soundData.type) {
      case OptionType.OK:
        const soundFileAndroid = await this.fetchSoundFileAndroid(
          soundData.data,
        );

        if (soundFileAndroid !== null) {
          return this.handlePronounceWordAndroid(soundFileAndroid);
        } else {
          throw new Error("Failed to play sound");
        }

      case OptionType.EMPTY:
        throw new Error("Failed to play sound");
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

  handlePronounceWordAndroid = async (soundData: Audio.Sound) => {
    if (soundData) {
      try {
        await soundData.playAsync();
        await soundData.unloadAsync();
      } catch (err) {
        throw new Error("Failed to play sound");
      }
    }
  };

  /** **********************************************************************
   * iOS:
   */

  fetchAndPlayWordiOS = async (word: string) => {
    let soundFiles = this.state.wordAudioMap[word];
    if (!soundFiles) {
      const fetchDirectly = this.getSoundFilesForWord(word);
      if (fetchDirectly) {
        soundFiles = await this.fetchSoundFilesForWord(fetchDirectly);
      }
    }

    if (soundFiles) {
      const randomIdx = randomInRange(0, soundFiles.length);
      const soundFile = soundFiles[randomIdx];
      await this.handlePronounceWordiOS(soundFile);
    } else {
      throw new Error("Failed to find sound files");
    }
  };

  handlePronounceWordiOS = async (soundData: Audio.Sound) => {
    if (soundData) {
      try {
        const status = await soundData.getStatusAsync();
        // @ts-ignore
        const position = status.positionMillis;
        if (typeof position === "number" && position > 0) {
          await soundData.replayAsync({
            positionMillis: 0,
          });
        } else {
          await soundData.playAsync();
        }
      } catch (err) {
        if (err.message === "Seeking interrupted.") {
          return; // Disregard this error...
        } else {
          throw new Error("Failed to play sound");
        }
      }
    }
  };

  /** **********************************************************************
   * Helper methods:
   */

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
        const soundData = this.getSoundFilesForWord(word);
        if (soundData) {
          const sounds = await this.fetchSoundFilesForWord(soundData);
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

  getSoundFilesForWord = (word: string) => {
    const soundData = audioRecordingsClass.getAudioRecordingsForWord(word);
    if (soundData.type === OptionType.OK) {
      return soundData.data;
    } else {
      return null;
    }
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

/**
 * Helper for updating audio metadata cache state.
 *
 * @param updatedKey sound audio key to update
 * @param `Partial<AudioMetadata>` partial metadata to update at key
 * @returns state update function which performs the nested update operation
 */
export const updateAudioMetadataCache = (
  updatedKey: string,
  updatedCacheData: Partial<AudioMetadata>,
) => (prevState: IState) => {
  const cache = prevState.audioMetadataCache;
  return {
    audioMetadataCache: {
      ...cache,
      [updatedKey]: {
        ...cache[updatedKey],
        ...updatedCacheData,
      },
    },
  };
};

/** ========================================================================
 * Provider Component
 * =========================================================================
 */

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
