import { Audio } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { GestureResponderEvent, Platform } from "react-native";
import { Button, Text } from "react-native-paper";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import Shaker from "@src/components/ShakerComponent";
import {
  SoundRecordingProps,
  withSoundRecordingProvider,
} from "@src/components/SoundRecordingProvider";
import { COLORS } from "@src/constants/Colors";
import { QUIZ_TYPE } from "@src/GlobalState";
import { audioRecordingsClass } from "@src/tools/audio-dictionary";
import {
  AudioItem,
  Lesson,
  OptionType,
  QuizScreenComponentProps,
} from "@src/tools/types";
import {
  capitalize,
  flattenLessonSet,
  getAlternateChoices,
  getAudioFileUrl,
  randomInRange,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps
  extends GlobalStateProps,
    QuizScreenComponentProps,
    SoundRecordingProps {}

interface IState {
  choices: Lesson;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class MultipleChoiceInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      choices: this.deriveAlternateChoices(),
    };
  }

  componentDidMount(): void {
    if (this.props.quizType === QUIZ_TYPE.PRONUNCIATION) {
      // this.fetchSoundFilesForWord();
      // this.props.prefetchLessonSoundData(this.props.lesson);
    }
  }

  componentDidUpdate(nextProps: IProps): void {
    if (
      nextProps.currentWord.traditional !== this.props.currentWord.traditional
    ) {
      if (this.props.quizType !== QUIZ_TYPE.PRONUNCIATION) {
        return this.setState({
          choices: this.deriveAlternateChoices(),
        });
      } else {
        this.setState({
          choices: this.deriveAlternateChoices(),
        });
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
      quizType,
    } = this.props;
    const shouldReveal = valid || attempted;
    const correctWord = currentWord[languageSetting];
    return (
      <React.Fragment>
        {quizType === QUIZ_TYPE.PRONUNCIATION ? (
          !this.props.playbackError ? (
            <VoiceButton
              onPress={() => this.props.pronounceWord(currentWord.traditional)}
            >
              <Text>
                {this.props.loadingSoundData
                  ? "Loading Sound File..."
                  : "Press to Speak!"}
              </Text>
            </VoiceButton>
          ) : (
            <FallbackTextContainer>
              <QuizPromptText quizType={quizType}>
                {`"${currentWord.english}"`}
              </QuizPromptText>
              <QuizSubText>{currentWord.pinyin}</QuizSubText>
              <Text style={{ marginTop: 15 }}>
                (Could not find audio file...)
              </Text>
            </FallbackTextContainer>
          )
        ) : (
          <TitleContainer>
            <QuizPromptText quizType={quizType}>
              {quizType === QUIZ_TYPE.ENGLISH
                ? correctWord
                : currentWord.english}
            </QuizPromptText>
            <QuizSubText>{currentWord.pinyin}</QuizSubText>
          </TitleContainer>
        )}
        <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
          <Container>
            {this.state.choices.map(choice => {
              const isCorrect = choice[languageSetting] === correctWord;
              return (
                <Choice
                  valid={valid}
                  attempted={attempted}
                  isCorrect={isCorrect}
                  quizType={quizType}
                  onPress={this.handleSelectAnswer(isCorrect)}
                >
                  <QuizAnswerText
                    valid={valid}
                    quizType={quizType}
                    attempted={attempted}
                    shouldReveal={shouldReveal}
                  >
                    {shouldReveal
                      ? `${choice[languageSetting]} - ${choice.pinyin} - ${
                          choice.english
                        }`
                      : quizType === QUIZ_TYPE.ENGLISH
                      ? capitalize(choice.english)
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
            Next Question
          </Button>
        ) : null}
      </React.Fragment>
    );
  }

  deriveAlternateChoices = () => {
    return getAlternateChoices(
      this.props.currentWord,
      flattenLessonSet(this.props.lessons),
      this.props.wordDictionary,
      this.props.quizType,
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
  quizType,
}: {
  children: string;
  valid: boolean;
  attempted: boolean;
  shouldReveal: boolean;
  quizType: QUIZ_TYPE;
}) => (
  <QuizAnswer
    style={{
      color: !valid && attempted ? "white" : "black",
      fontWeight: shouldReveal
        ? "400"
        : quizType === QUIZ_TYPE.ENGLISH
        ? "300"
        : "bold",
      fontSize: shouldReveal ? 15 : quizType === QUIZ_TYPE.ENGLISH ? 22 : 45,
    }}
  >
    {children}
  </QuizAnswer>
);

const VoiceButton = glamorous.touchableOpacity({
  marginTop: 25,
  marginBottom: 25,
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
  quizType,
}: {
  children: string;
  quizType: QUIZ_TYPE;
}) => (
  <Text
    style={{
      fontWeight: "bold",
      fontSize: quizType === QUIZ_TYPE.ENGLISH ? 52 : 26,
    }}
  >
    {children}
  </Text>
);

const QuizSubText = glamorous.text({
  fontSize: 22,
  marginTop: 12,
  marginBottom: 12,
});

const Choice = ({
  children,
  valid,
  attempted,
  isCorrect,
  quizType,
  onPress,
}: {
  children: JSX.Element;
  valid: boolean;
  attempted: boolean;
  isCorrect: boolean;
  quizType: QUIZ_TYPE;
  onPress: (event: GestureResponderEvent) => void;
}) => (
  <Button
    dark
    mode="contained"
    style={{
      marginTop: 12,
      width: "90%",
      height: quizType === QUIZ_TYPE.ENGLISH ? 50 : 75,
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

export default withGlobalState(withSoundRecordingProvider(MultipleChoiceInput));
