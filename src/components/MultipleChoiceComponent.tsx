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
import { audioRecordingsClass } from "@src/tools/dictionary";
import { Lesson, OptionType, Word } from "@src/tools/types";
import {
  getAlternateChoices,
  getAudioFileUrl,
  MC_TYPE,
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
  lesson: Lesson;
  multipleChoiceType: MC_TYPE;
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
  currentSoundAudio: Audio.Sound;
  currentSoundFileUri: string;
  bufferingSoundFile: boolean;
  wordAudioMap: { [key: string]: Audio.Sound };
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
      currentSoundAudio: new Audio.Sound(),
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
        {multipleChoiceType === "MANDARIN_PRONUNCIATION" &&
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
          <QuizPromptText multipleChoiceType={multipleChoiceType}>
            {currentWord.english}
          </QuizPromptText>
        )}
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
            Proceed
          </Button>
        ) : null}
      </React.Fragment>
    );
  }

  handlePronounceWord = async () => {
    if (!this.state.loadingSoundData) {
      try {
        if (this.state.playedOnce) {
          try {
            await this.state.currentSoundAudio.replayAsync({
              positionMillis: 0,
            });
          } catch (err) {
            console.log("Error replaying sound file?");
          }
        } else {
          await this.state.currentSoundAudio.playAsync();
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
        const soundObject = new Audio.Sound();
        const uri = getAudioFileUrl(soundData.data[0].filePath || "");
        await soundObject.loadAsync({
          uri,
        });
        return this.setState({
          loadingSoundData: false,
          currentSoundAudio: soundObject,
        });
      case OptionType.EMPTY:
        console.log("No sound file uri found!!!");
        return this.setState({ playbackError: true });
    }
  };

  prefetchLessonSoundData = async () => {
    const words = this.props.lesson.map((word: Word) => {
      return word[this.props.languageSetting];
    });

    const wordAudioMap = (await Promise.all(
      words.map(async (word: string) => {
        const soundData = audioRecordingsClass.getAudioRecordingsForWord(word);
        if (soundData.type === OptionType.OK) {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync({
            uri: getAudioFileUrl(soundData.data[0].filePath || ""),
          });
          return { word, soundObject };
        } else {
          return null;
        }
      }),
    ))
      .filter(Boolean)
      .reduce((map, recordingData) => {
        if (recordingData) {
          const { word, soundObject } = recordingData;
          return {
            ...map,
            [word]: soundObject,
          };
        } else {
          return map;
        }
      }, {});

    this.setState({ wordAudioMap });
  };

  deriveAlternateChoices = () => {
    return getAlternateChoices(
      this.props.currentWord,
      this.props.lessons.reduce((flat, curr) => [...flat, ...curr]),
      this.props.multipleChoiceType,
    );
  };

  handleSelectAnswer = (isCorrect: boolean) => () => {
    if (!this.props.attempted) {
      this.props.handleCheck(isCorrect);
    }
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
  multipleChoiceType: MC_TYPE;
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

const QuizPromptText = ({
  children,
  multipleChoiceType,
}: {
  children: string;
  multipleChoiceType: MC_TYPE;
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
  multipleChoiceType: MC_TYPE;
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
