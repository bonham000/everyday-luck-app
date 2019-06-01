import { Audio } from "expo";
import React, { ComponentType } from "react";
import { Platform } from "react-native";

import SoundRecordingContext, {
  AudioMetadata,
  AudioMetadataCache,
} from "@src/providers/SoundRecordingContext";
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
  prefetchLessonSoundData: (lesson: Lesson) => Promise<void>;
  handlePronounceWord: (traditionalCharacters: string) => Promise<void>;
}

interface IProps {
  disableAudio: boolean;
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

class SoundRecordingProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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
    /**
     * Defer to user setting.
     */
    if (this.props.disableAudio) {
      return;
    }

    /**
     * The logic diverges on iOS and Android because the Android Audio API
     * is shit and cannot load multiple audio files at once.
     *
     * On iOS, we keep a cache of any audio files that are needed so they
     * can be played more quickly.
     */
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
        await soundData.replayAsync({ positionMillis: 0 });
      } catch (err) {
        throw new Error("Failed to play sound");
      }
    }
  };

  /** **********************************************************************
   * iOS:
   */

  fetchAndPlayWordiOS = async (word: string) => {
    /**
     * Use the cache files first - if the file is not cached yet just
     * fetch it directly to avoid waiting for the cached files to all be
     * fetched.
     *
     * This may result in a duplicated file request... but will not block
     * the user waiting for the first file to download.
     */
    let cachedSoundFiles = this.state.wordAudioMap[word];
    if (!cachedSoundFiles) {
      const manuallyFetch = this.getSoundFilesForWord(word);
      if (manuallyFetch) {
        cachedSoundFiles = await this.fetchSoundFilesForWord(manuallyFetch);
      }
    }

    if (cachedSoundFiles) {
      const randomIdx = randomInRange(0, cachedSoundFiles.length);
      const soundFile = cachedSoundFiles[randomIdx];
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

    /**
     * Fetch all the sound files for the given lesson and fetch their
     * audio content. Save this in the wordAudioMap cache in local
     * state so these files can be played immediately when needed.
     */

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
