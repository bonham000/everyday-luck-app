import { Audio } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button, Text } from "react-native-paper";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import Shaker from "@src/components/ShakerComponent";
import { COLORS } from "@src/constants/Colors";
import { audioRecordingsClass } from "@src/tools/audio-dictionary";
import {
  AudioItem,
  HSKList,
  Lesson,
  MultipleChoiceComponentType,
  OptionType,
  Word,
} from "@src/tools/types";
import {
  flattenLessonSet,
  getAlternateChoices,
  getAudioFileUrl,
  randomInRange,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  valid: boolean;
  revealAnswer: boolean;
  didReveal: boolean;
  currentWord: Word;
  shouldShake: boolean;
  attempted: boolean;
  value: string;
  lesson: HSKList;
  multipleChoiceType: MultipleChoiceComponentType;
  setInputRef: () => void;
  handleChange: () => void;
  handleProceed: () => (event: GestureResponderEvent) => void;
  handleToggleRevealAnswer: (event: GestureResponderEvent) => void;
  handleCheck: (correct: boolean) => (event: GestureResponderEvent) => void;
}

interface IState {
  choices: Lesson;
  playbackError: boolean;
  loadingSoundData: boolean;
  playedOnce: boolean;
  currentSoundAudio: ReadonlyArray<Audio.Sound>;
  currentSoundFileUri: string;
  bufferingSoundFile: boolean;
  wordAudioMap: { [key: string]: ReadonlyArray<Audio.Sound> };
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class MultipleChoiceInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      wordAudioMap: {},
      playedOnce: false,
      playbackError: false,
      loadingSoundData: true,
      bufferingSoundFile: false,
      currentSoundAudio: [new Audio.Sound()],
      currentSoundFileUri: "",
      choices: this.deriveAlternateChoices(),
    };
  }

  componentDidMount(): void {
    if (this.props.multipleChoiceType === "MANDARIN_PRONUNCIATION") {
      this.fetchSoundDataForWord();
      this.prefetchLessonSoundData();
    }
  }

  componentDidUpdate(nextProps: IProps): void {
    if (
      nextProps.currentWord.traditional !== this.props.currentWord.traditional
    ) {
      if (this.props.multipleChoiceType !== "MANDARIN_PRONUNCIATION") {
        return this.setState({
          choices: this.deriveAlternateChoices(),
        });
      } else {
        if (this.state.playbackError) {
          return this.setState({
            loadingSoundData: false,
            choices: this.deriveAlternateChoices(),
          });
        }
        const { wordAudioMap } = this.state;
        const word = this.props.currentWord.traditional;
        if (word in wordAudioMap && wordAudioMap[word] !== null) {
          this.setState({
            playedOnce: false,
            loadingSoundData: false,
            choices: this.deriveAlternateChoices(),
            currentSoundAudio: wordAudioMap[word],
          });
        } else {
          this.setState(
            {
              playedOnce: false,
              loadingSoundData: true,
              choices: this.deriveAlternateChoices(),
            },
            this.fetchSoundDataForWord,
          );
        }
      }
    }
  }

  render(): JSX.Element {
    const {
      valid,
      currentWord,
      shouldShake,
      attempted,
      handleProceed,
      languageSetting,
      multipleChoiceType,
    } = this.props;
    const shouldReveal = valid || attempted;
    const correctWord = currentWord[languageSetting];
    return (
      <React.Fragment>
        <TitleContainer>
          {multipleChoiceType !== "MANDARIN_PRONUNCIATION" && (
            <QuizPromptText multipleChoiceType={multipleChoiceType}>
              {multipleChoiceType === "ENGLISH"
                ? correctWord
                : currentWord.english}
            </QuizPromptText>
          )}
        </TitleContainer>
        <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
          <Container>
            {this.state.choices.map(choice => {
              const isCorrect = choice[languageSetting] === correctWord;
              return (
                <Choice
                  valid={valid}
                  attempted={attempted}
                  isCorrect={isCorrect}
                  multipleChoiceType={multipleChoiceType}
                  onPress={this.handleSelectAnswer(isCorrect)}
                >
                  <QuizAnswerText
                    valid={valid}
                    attempted={attempted}
                    shouldReveal={shouldReveal}
                    multipleChoiceType={multipleChoiceType}
                  >
                    {shouldReveal
                      ? `${choice[languageSetting]} - ${choice.pinyin} - ${
                          choice.english
                        }`
                      : multipleChoiceType === "ENGLISH"
                      ? choice.english
                      : choice[languageSetting]}
                  </QuizAnswerText>
                </Choice>
              );
            })}
          </Container>
        </Shaker>
        {multipleChoiceType === "MANDARIN_PRONUNCIATION" ? (
          !this.state.playbackError ? (
            <VoiceButton onPress={this.handlePronounceWord}>
              <Text>
                {this.state.loadingSoundData
                  ? "Loading Sound File..."
                  : this.state.bufferingSoundFile
                  ? "Preparing sound file"
                  : "Press to Speak!"}
              </Text>
            </VoiceButton>
          ) : (
            <FallbackTextContainer>
              <QuizPromptText multipleChoiceType={multipleChoiceType}>
                {`"${currentWord.english}"`}
              </QuizPromptText>
              <Text style={{ marginTop: 15 }}>
                (Could not load audio file...)
              </Text>
            </FallbackTextContainer>
          )
        ) : null}
        {shouldReveal ? (
          <Button
            dark
            mode="contained"
            style={{
              marginTop: 30,
              minWidth: 215,
              backgroundColor: COLORS.primaryBlue,
            }}
            onPress={handleProceed()}
          >
            Next Question
          </Button>
        ) : null}
      </React.Fragment>
    );
  }

  handlePronounceWord = async () => {
    if (!this.state.loadingSoundData) {
      try {
        const audioIndex = this.getRandomWordIndex();
        if (this.state.playedOnce) {
          try {
            await this.state.currentSoundAudio[audioIndex].replayAsync({
              positionMillis: 0,
            });
          } catch (err) {
            console.log("Error replaying sound file?");
          }
        } else {
          await this.state.currentSoundAudio[audioIndex].playAsync();
        }
        this.setState({
          playedOnce: true,
        });
      } catch (error) {
        console.log("Failed to play sound file!", error);
        this.setState({
          playbackError: true,
        });
      }
    }
  };

  fetchSoundDataForWord = async () => {
    const word = this.props.currentWord[this.props.languageSetting];
    const soundData = audioRecordingsClass.getAudioRecordingsForWord(word);
    switch (soundData.type) {
      case OptionType.OK:
        const sounds = await this.fetchSoundFilesForWord(soundData.data);
        if (sounds !== null) {
          const currentSoundAudio = sounds as ReadonlyArray<Audio.Sound>;
          return this.setState({
            currentSoundAudio,
            loadingSoundData: false,
          });
        } else {
          return this.setState({ playbackError: true });
        }

      case OptionType.EMPTY:
        console.log("No sound file uri found!!!");
        return this.setState({ playbackError: true });
    }
  };

  prefetchLessonSoundData = async () => {
    const words = this.props.lesson.content.map((word: Word) => {
      return word[this.props.languageSetting];
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

    this.setState({ wordAudioMap });
  };

  fetchSoundFilesForWord = async (soundData: ReadonlyArray<AudioItem>) => {
    return Promise.all(
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
  };

  deriveAlternateChoices = () => {
    return getAlternateChoices(
      this.props.currentWord,
      flattenLessonSet(this.props.lessons),
      this.props.wordDictionary,
      this.props.multipleChoiceType,
    );
  };

  handleSelectAnswer = (isCorrect: boolean) => () => {
    if (!this.props.attempted) {
      this.props.handleCheck(isCorrect);
    }
  };

  getRandomWordIndex = (
    min = 0,
    max = this.state.currentSoundAudio.length,
  ): number => {
    return randomInRange(min, max);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TitleContainer = glamorous.view({
  marginTop: 25,
  padding: 12,
  width: "100%",
  alignItems: "center",
});

const Container = glamorous.view({
  width: "100%",
  alignItems: "center",
});

const QuizAnswerText = ({
  children,
  valid,
  attempted,
  shouldReveal,
  multipleChoiceType,
}: {
  children: string;
  valid: boolean;
  attempted: boolean;
  shouldReveal: boolean;
  multipleChoiceType: MultipleChoiceComponentType;
}) => (
  <QuizAnswer
    style={{
      color: !valid && attempted ? "white" : "black",
      fontWeight: shouldReveal ? "400" : "bold",
      fontSize: shouldReveal ? 15 : multipleChoiceType === "ENGLISH" ? 22 : 45,
    }}
  >
    {children}
  </QuizAnswer>
);

const VoiceButton = glamorous.touchableOpacity({
  marginTop: 25,
  width: "85%",
  height: 55,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.actionButtonYellow,
});

const QuizAnswer = glamorous.text({
  color: "black",
  marginTop: 15,
  marginBottom: 15,
});

const FallbackTextContainer = glamorous.view({
  marginTop: 25,
  marginBottom: 15,
  alignItems: "center",
  justifyContent: "center",
});

const QuizPromptText = ({
  children,
  multipleChoiceType,
}: {
  children: string;
  multipleChoiceType: MultipleChoiceComponentType;
}) => (
  <Text
    style={{
      fontWeight: "bold",
      fontSize: multipleChoiceType === "ENGLISH" ? 52 : 26,
    }}
  >
    {children}
  </Text>
);

const Choice = ({
  children,
  valid,
  attempted,
  isCorrect,
  multipleChoiceType,
  onPress,
}: {
  children: JSX.Element;
  valid: boolean;
  attempted: boolean;
  isCorrect: boolean;
  multipleChoiceType: MultipleChoiceComponentType;
  onPress: (event: GestureResponderEvent) => void;
}) => (
  <Button
    dark
    mode="contained"
    style={{
      marginTop: 12,
      width: "90%",
      height: multipleChoiceType === "ENGLISH" ? 50 : 75,
      justifyContent: "center",
      backgroundColor: valid
        ? isCorrect
          ? COLORS.actionButtonMint
          : COLORS.lightDark
        : attempted
        ? isCorrect
          ? COLORS.actionButtonMint
          : COLORS.primaryRed
        : COLORS.lightDark,
    }}
    onPress={onPress}
  >
    {children}
  </Button>
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(MultipleChoiceInput);
