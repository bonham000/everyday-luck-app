import styled from "@emotion/native";
import * as Speech from "expo-speech";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { Container, StyledText } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { Lesson, LessonScreenParams } from "@src/tools/types";
import { assertUnreachable, knuthShuffle } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
}

type QUIZ_STATE = "QUIZ" | "REVEAL";

/* State enum to represent all the possible states for the quiz logic */
enum STATE_ENUM {
  REPEAT_QUIZ = "REPEAT_QUIZ",
  ADVANCE_TO_NEXT_WORD = "ADVANCE_TO_NEXT_WORD",
  REVEAL_ANSWER = "REVEAL_ANSWER",
  REPEAT_CHINESE_PRONUNCIATION = "REPEAT_CHINESE_PRONUNCIATION",
  DECREMENT_TIMER = "DECREMENT_TIMER",
}

interface IState {
  words: Lesson;
  index: number;
  lesson: Lesson;
  completed: number;
  quizState: QUIZ_STATE;
  time: number;
}

const QUIZ_TIMEOUT = 6;
const REPEAT_TIMEOUT = QUIZ_TIMEOUT - 2;
const REVEAL_TIMEOUT = 3;

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class AudioReviewAllScreen extends React.Component<IProps, IState> {
  timer: any = null;

  constructor(props: IProps) {
    super(props);

    const lesson = this.props.navigation.getParam("lesson");
    const words = knuthShuffle(lesson);

    this.state = {
      words,
      lesson,
      index: 0,
      completed: 0,
      time: QUIZ_TIMEOUT,
      quizState: "QUIZ",
    };
  }

  componentDidMount(): void {
    this.executeQuizLogic();
    this.speak();
  }

  componentWillUnmount(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render(): JSX.Element {
    const { index, words, time } = this.state;
    const { languageSetting } = this.props;
    const currentWord = words[index];
    const currentText = currentWord[languageSetting];
    return (
      <Container>
        <TopSection>
          <ProgressText>
            Progress: {index + 1} / {this.state.lesson.length} completed, timer:{" "}
            {time}
          </ProgressText>
          <Title>Audio Review Quiz</Title>
        </TopSection>
        <WordContainer style={{ marginTop: 125 }}>
          <WordTitle>{currentText}</WordTitle>
        </WordContainer>
        <Title style={{ marginTop: 50 }}>Answer:</Title>
        {this.state.quizState === "REVEAL" ? (
          <React.Fragment>
            <AnswerContainer>
              <AnswerTitle>{currentWord.pinyin}</AnswerTitle>
            </AnswerContainer>
            <AnswerContainer>
              <AnswerTitle>{currentWord.english}</AnswerTitle>
            </AnswerContainer>
          </React.Fragment>
        ) : (
          <AnswerContainer
            style={{ backgroundColor: COLORS.listenBlockDefault }}
          >
            <AnswerTitle>???</AnswerTitle>
          </AnswerContainer>
        )}
      </Container>
    );
  }

  deriveCurrentStateEnum = () => {
    const { time, quizState, index, words } = this.state;
    if (time === 1 && quizState === "REVEAL") {
      const nextIndex = index + 1;
      if (nextIndex === words.length) {
        return STATE_ENUM.REPEAT_QUIZ;
      } else {
        return STATE_ENUM.ADVANCE_TO_NEXT_WORD;
      }
    } else if (time === 1) {
      return STATE_ENUM.REVEAL_ANSWER;
    } else if (time === REPEAT_TIMEOUT && quizState === "QUIZ") {
      return STATE_ENUM.REPEAT_CHINESE_PRONUNCIATION;
    } else {
      return STATE_ENUM.DECREMENT_TIMER;
    }
  };

  advanceQuizStateMachine = () => {
    const { time, index, lesson } = this.state;
    const currentState = this.deriveCurrentStateEnum();

    switch (currentState) {
      /* Word set completed, shuffle and repeat */
      case STATE_ENUM.REPEAT_QUIZ:
        return this.setState(
          {
            index: 0,
            time: QUIZ_TIMEOUT,
            quizState: "QUIZ",
            words: knuthShuffle(lesson),
          },
          this.handleProceed,
        );
      /* Word completed, advance to next word and quiz */
      case STATE_ENUM.ADVANCE_TO_NEXT_WORD:
        return this.setState(
          {
            time: QUIZ_TIMEOUT,
            quizState: "QUIZ",
            index: index + 1,
          },
          this.handleProceed,
        );
      case STATE_ENUM.REVEAL_ANSWER:
        /* Pronunciation quiz completed, advance to reveal English */
        return this.setState(
          {
            time: REVEAL_TIMEOUT,
            quizState: "REVEAL",
          },
          this.handleProceed,
        );
      case STATE_ENUM.REPEAT_CHINESE_PRONUNCIATION:
        /* Still quizzing, repeat the Chinese pronunciation */
        return this.setState(
          {
            time: time - 1,
          },
          this.handleProceed,
        );
      case STATE_ENUM.DECREMENT_TIMER:
        /* No state change, just decrement the timer by 1 second and repeat */
        return this.setState(
          {
            time: time - 1,
          },
          this.executeQuizLogic,
        );
      default:
        return assertUnreachable(currentState);
    }
  };

  executeQuizLogic = () => {
    // tslint:disable-next-line
    this.timer = setTimeout(this.advanceQuizStateMachine, 1000);
  };

  handleProceed = () => {
    this.speak();
    this.executeQuizLogic();
  };

  speak = () => {
    try {
      const currentWord = this.state.words[this.state.index];
      if (this.state.quizState === "QUIZ") {
        Speech.speak(currentWord.traditional, { language: "zh" });
      } else {
        Speech.speak(currentWord.english, { language: "en" });
      }
    } catch (err) {
      /* Do nothing ~ */
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TopSection = styled.View({});

const ProgressText = styled(StyledText)`
  margin-top: 8;
  font-size: 10;
  text-align: center;
`;

const Title = styled(StyledText)`
  margin-top: 16;
  font-size: 18;
  text-align: center;
`;

const WordTitle = styled(StyledText)`
  font-size: 45;
  font-weight: bold;
  text-align: center;
`;

const AnswerTitle = styled(StyledText)`
  font-size: 22;
  font-weight: bold;
  text-align: center;
`;

const WordContainer = styled.View<any>`
  margin-top: 25px;
  height: 85px;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.dark};
`;

const AnswerContainer = styled.View<any>`
  margin-top: 25px;
  height: 75px;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.dark};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(AudioReviewAllScreen);
