import styled from "@emotion/native";
import React from "react";
import { GestureResponderEvent, TextStyle, View } from "react-native";
import { Text } from "react-native-paper";

import { NativeStyleThemeProps } from "@src/AppContainer";
import Shaker from "@src/components/ShakerComponent";
import { Button, StyledText } from "@src/components/SharedComponents";
import { SMALL_DEVICE } from "@src/constants/Device";
import { COLORS } from "@src/constants/Theme";
import {
  APP_LANGUAGE_SETTING,
  QUIZ_TYPE,
} from "@src/providers/GlobalStateContext";
import { GlobalStateContextProps } from "@src/providers/GlobalStateProvider";
import { SoundRecordingProps } from "@src/providers/SoundRecordingProvider";
import { Lesson, QuizScreenComponentProps, Word } from "@src/tools/types";
import {
  capitalize,
  flattenLessonSet,
  getAlternateChoices,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps
  extends GlobalStateContextProps,
    QuizScreenComponentProps,
    SoundRecordingProps {}

interface IState {
  choices: Lesson;
  audioEscapeHatchOn: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class MultipleChoiceInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      audioEscapeHatchOn: false,
      choices: this.deriveAlternateChoices(),
    };
  }

  componentDidUpdate(nextProps: IProps): void {
    if (
      nextProps.currentWord.traditional !== this.props.currentWord.traditional
    ) {
      this.setState({
        audioEscapeHatchOn: false,
        choices: this.deriveAlternateChoices(),
      });
    }
  }

  render(): JSX.Element {
    const {
      valid,
      quizType,
      attempted,
      currentWord,
      shouldShake,
      handleProceed,
      languageSetting,
      autoProceedQuestion,
    } = this.props;
    const shouldReveal = valid || attempted;
    const correctWord = currentWord[languageSetting];
    return (
      <React.Fragment>
        {this.getSoundPlayControl()}
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
                  key={choice.traditional}
                  onPress={this.handleSelectAnswer(isCorrect)}
                >
                  <QuizAnswerText
                    choice={choice}
                    quizType={quizType}
                    shouldReveal={shouldReveal}
                    languageSetting={languageSetting}
                  />
                </Choice>
              );
            })}
          </Container>
        </Shaker>
        {quizType === QUIZ_TYPE.PRONUNCIATION && (
          <AudioEscapeBlock onPress={this.activateAudioEscapeHatch}>
            <AudioEscapeText>Reveal Definition</AudioEscapeText>
          </AudioEscapeBlock>
        )}
        {shouldReveal && (!autoProceedQuestion || !valid) && (
          <Button
            style={{
              marginTop: 30,
              minWidth: 215,
              backgroundColor: COLORS.primaryBlue,
            }}
            onPress={handleProceed}
          >
            Next Question
          </Button>
        )}
      </React.Fragment>
    );
  }

  getSoundPlayControl = () => {
    const {
      quizType,
      currentWord,
      audioDisabled,
      playbackError,
      languageSetting,
    } = this.props;
    const { traditional } = currentWord;
    const soundLoadingError = playbackError;

    /**
     * Regular quiz type:
     */
    if (quizType !== QUIZ_TYPE.PRONUNCIATION) {
      const correctWord = currentWord[languageSetting];
      return (
        <TitleContainer
          onPress={() => {
            this.props.handlePronounceWord(traditional);
          }}
        >
          {quizType === QUIZ_TYPE.ENGLISH && (
            <QuizPromptText quizType={quizType}>{correctWord}</QuizPromptText>
          )}
          {quizType !== QUIZ_TYPE.ENGLISH && (
            <QuizSubText>{currentWord.pinyin}</QuizSubText>
          )}
        </TitleContainer>
      );
    }

    /**
     * Some error state: sound file is not available - show the audio fallback UI
     */
    if (audioDisabled || soundLoadingError || this.state.audioEscapeHatchOn) {
      let disabledText = "";
      if (audioDisabled) {
        disabledText = "(Audio disabled)";
      } else {
        disabledText = "(Could not find audio file...)";
      }

      return (
        <TitleContainer>
          <QuizPromptText quizType={quizType}>
            {`"${currentWord.english}"`}
          </QuizPromptText>
          <QuizSubText>{currentWord.pinyin}</QuizSubText>
          {!this.state.audioEscapeHatchOn && (
            <Text style={{ marginTop: 15, color: COLORS.darkText }}>
              {disabledText}
            </Text>
          )}
        </TitleContainer>
      );
    } else {
      /**
       * All good - render the audio pronunciation controls:
       */
      return (
        <TitleContainer>
          <VoiceButton
            onPress={() => {
              this.props.handlePronounceWord(traditional);
            }}
          >
            <Text>Press to Speak!</Text>
          </VoiceButton>
        </TitleContainer>
      );
    }
  };

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

  activateAudioEscapeHatch = () => {
    this.setState({ audioEscapeHatchOn: true });
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TitleContainer = styled.TouchableOpacity({
  marginTop: SMALL_DEVICE ? 15 : 25,
  marginBottom: SMALL_DEVICE ? 10 : 25,
  padding: 12,
  height: SMALL_DEVICE ? 90 : 115,
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
});

const Container = styled.View({
  width: "100%",
  alignItems: "center",
});

const VoiceButton = styled.TouchableOpacity({
  width: "85%",
  height: SMALL_DEVICE ? 40 : 55,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.actionButtonOrange,
});

const QuizPromptText = ({
  children,
  quizType,
}: {
  children: string | Element;
  quizType: QUIZ_TYPE;
}) => {
  const font = quizType === QUIZ_TYPE.ENGLISH ? 52 : 26;
  const fontSize = SMALL_DEVICE ? font * 0.8 : font;
  return (
    <ThemedText
      numberOfLines={1}
      adjustsFontSizeToFit
      style={{
        fontWeight: "bold",
        fontSize,
      }}
    >
      {children}
    </ThemedText>
  );
};

const ThemedText = styled.Text<any>`
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark"
      ? COLORS.choiceBlockTextDarkTheme
      : COLORS.darkText};
`;

const QuizSubText = styled(ThemedText)`
  font-size: 22px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const AudioEscapeBlock = styled.TouchableOpacity({
  right: 30,
  bottom: 25,
  height: 50,
  width: 225,
  position: "absolute",
  justifyContent: "center",
});

const AudioEscapeText = styled(StyledText)({
  textAlign: "right",
  fontSize: 14,
  fontWeight: "bold",
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
}) => {
  const height = quizType === QUIZ_TYPE.ENGLISH ? 50 : 75;
  return (
    <ChoiceBlock
      valid={valid}
      isCorrect={isCorrect}
      isAttempted={attempted}
      style={{
        width: "90%",
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: height - (SMALL_DEVICE ? 15 : 0),
      }}
      onPress={onPress}
    >
      {children}
    </ChoiceBlock>
  );
};

const ChoiceBlock = styled.TouchableOpacity<any>`
  background-color: ${(
    props: NativeStyleThemeProps & {
      valid: boolean;
      isCorrect: boolean;
      isAttempted: boolean;
    },
  ) => {
    if (props.valid) {
      if (props.isCorrect) {
        return COLORS.actionButtonMint;
      } else {
        if (props.theme.type === "dark") {
          return COLORS.choiceBlockDarkTheme;
        } else {
          return COLORS.choiceDefault;
        }
      }
    } else if (props.isAttempted) {
      if (props.isCorrect) {
        return COLORS.actionButtonMint;
      } else {
        return COLORS.primaryRed;
      }
    }

    if (props.theme.type === "dark") {
      return COLORS.choiceBlockDarkTheme;
    } else {
      return COLORS.lessonBlockLightInactive;
    }
  }};
`;

const QuizAnswerText = ({
  shouldReveal,
  quizType,
  choice,
  languageSetting,
}: {
  shouldReveal: boolean;
  quizType: QUIZ_TYPE;
  choice: Word;
  languageSetting: APP_LANGUAGE_SETTING;
}) => {
  const font = shouldReveal ? 15 : quizType === QUIZ_TYPE.ENGLISH ? 22 : 45;
  const fontSize = SMALL_DEVICE ? font * 0.7 : font;
  const textStyles: TextStyle = {
    fontWeight: shouldReveal
      ? "400"
      : quizType === QUIZ_TYPE.ENGLISH
      ? "400"
      : "bold",
    fontSize,
  };

  const Content =
    choice.traditional.length > 4 ? (
      <ThemedText numberOfLines={1} allowFontScaling style={textStyles}>
        {choice.english}
      </ThemedText>
    ) : (
      <>
        <ThemedText
          numberOfLines={1}
          allowFontScaling
          style={{ fontSize: SMALL_DEVICE ? 15 : 30, paddingRight: 10 }}
        >
          {choice[languageSetting]}
        </ThemedText>
        <ThemedText numberOfLines={1} allowFontScaling style={textStyles}>
          {choice.pinyin} - {choice.english}
        </ThemedText>
      </>
    );

  if (shouldReveal) {
    return (
      <View
        style={{
          width: "80%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Content}
      </View>
    );
  }

  return quizType === QUIZ_TYPE.ENGLISH ? (
    <ThemedText numberOfLines={1} allowFontScaling style={textStyles}>
      {capitalize(choice.english)}
    </ThemedText>
  ) : (
    <ThemedText numberOfLines={1} allowFontScaling style={textStyles}>
      {choice[languageSetting]}
    </ThemedText>
  );
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default MultipleChoiceInput;
