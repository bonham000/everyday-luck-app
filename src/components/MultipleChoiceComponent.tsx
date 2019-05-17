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
import { fetchWordPronunciation } from "@src/tools/api";
import { Lesson, OptionType, Word } from "@src/tools/types";
import {
  getAlternateChoices,
  MC_TYPE,
  transformSoundFileResponse,
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
  currentSoundFileUri: string;
  wordAudioMap: { [key: string]: string };
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
      playbackError: false,
      loadingSoundData: true,
      currentSoundFileUri: "",
      choices: this.deriveAlternateChoices(),
    };
  }

  componentDidMount(): void {
    if (this.props.multipleChoiceType === "MANDARIN_PRONUNCIATION") {
      this.fetchSoundData();
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
        const { wordAudioMap } = this.state;
        const word = this.props.currentWord.traditional;
        if (word in wordAudioMap && wordAudioMap[word] !== null) {
          this.setState({
            playbackError: false,
            loadingSoundData: false,
            choices: this.deriveAlternateChoices(),
            currentSoundFileUri: wordAudioMap[word],
          });
        } else {
          this.setState(
            {
              playbackError: false,
              loadingSoundData: true,
              choices: this.deriveAlternateChoices(),
            },
            this.fetchSoundData,
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
    const correctWord = currentWord[languageSetting];
    const shouldReveal = valid || attempted;
    return (
      <React.Fragment>
        <TitleContainer>
          {multipleChoiceType === "MANDARIN_PRONUNCIATION" ? (
            <VoiceButton onPress={this.handlePronounce}>
              <Text>
                {this.state.loadingSoundData
                  ? "Loading Sound Data..."
                  : "Press to Speak!"}
              </Text>
            </VoiceButton>
          ) : (
            <QuizPromptText multipleChoiceType={multipleChoiceType}>
              {multipleChoiceType === "MANDARIN"
                ? currentWord.english
                : correctWord}
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

  handlePronounce = async () => {
    if (!this.state.loadingSoundData) {
      try {
        const { currentSoundFileUri } = this.state;
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync({ uri: currentSoundFileUri });
        await soundObject.playAsync();
      } catch (error) {
        console.log("Failed to play sound file!");
        this.setState({
          playbackError: true,
        });
      }
    }
  };

  fetchSoundData = async () => {
    const soundData = await fetchWordPronunciation(
      this.props.currentWord[this.props.languageSetting],
    );

    const soundFileResult = transformSoundFileResponse(soundData);

    switch (soundFileResult.type) {
      case OptionType.OK:
        return this.setState({
          currentSoundFileUri: soundFileResult.data,
          loadingSoundData: false,
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

    const fetchWords = await Promise.all(
      words.map(async word => {
        const result = await fetchWordPronunciation(word);
        const uriResult = transformSoundFileResponse(result);

        switch (uriResult.type) {
          case OptionType.OK:
            return { word, uri: uriResult.data };
          case OptionType.EMPTY:
            return { word, uri: null };
        }
      }),
    );

    const wordAudioMap = fetchWords.reduce((map, { word, uri }) => {
      return {
        ...map,
        [word]: uri,
      };
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
  width: "85%",
  height: 45,
  alignItems: "center",
  justifyContent: "center",
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
  onPress,
}: {
  children: JSX.Element;
  valid: boolean;
  attempted: boolean;
  isCorrect: boolean;
  onPress: (event: GestureResponderEvent) => void;
}) => (
  <Button
    dark
    mode="contained"
    style={{
      marginTop: 12,
      width: "90%",
      height: 80,
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
