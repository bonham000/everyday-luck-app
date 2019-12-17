import * as Speech from "expo-speech";
import glamorous from "glamorous-native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { Lesson, LessonScreenParams } from "@src/tools/types";
import { knuthShuffle } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
}

type TIMER_STATE = "QUIZ" | "REVEAL";

interface IState {
  words: Lesson;
  index: number;
  lesson: Lesson;
  completed: number;
  timerState: TIMER_STATE;
  time: number;
}

const TIMEOUT = 3;

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
      time: TIMEOUT,
      timerState: "QUIZ",
    };
  }

  componentDidMount(): void {
    this.setTimeout();
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
            Progress: {this.state.completed} / {this.state.lesson.length}{" "}
            completed, timer: {time}
          </ProgressText>
          <Title>Audio Review Quiz</Title>
        </TopSection>
        <WordContainer style={{ marginTop: 155 }}>
          <WordTitle>{currentText}</WordTitle>
        </WordContainer>
        <Title style={{ marginTop: 50 }}>Answer:</Title>
        {this.state.timerState === "REVEAL" ? (
          <React.Fragment>
            <AnswerContainer>
              <AnswerTitle>{currentWord.pinyin}</AnswerTitle>
            </AnswerContainer>
            <AnswerContainer>
              <AnswerTitle style={{ fontSize: 18 }}>
                {currentWord.english}
              </AnswerTitle>
            </AnswerContainer>
          </React.Fragment>
        ) : (
          <AnswerContainer>
            <AnswerTitle>???</AnswerTitle>
          </AnswerContainer>
        )}
      </Container>
    );
  }

  setTimeout = () => {
    // tslint:disable-next-line
    this.timer = setTimeout(() => {
      const { time, timerState, index, words } = this.state;
      if (time === 1 && timerState === "REVEAL") {
        const nextIndex = index + 1;
        if (nextIndex === words.length) {
          this.randomizeDeck();
          this.setState({
            index: 0,
            time: TIMEOUT,
            timerState: "QUIZ",
          });
        } else {
          this.setState(
            {
              time: TIMEOUT,
              timerState: "QUIZ",
              index: nextIndex,
            },
            () => {
              this.speak();
              this.setTimeout();
            },
          );
        }
      } else if (time === 1) {
        this.setState(
          {
            time: TIMEOUT,
            timerState: "REVEAL",
          },
          () => {
            this.speak();
            this.setTimeout();
          },
        );
      } else {
        this.setState(
          {
            time: time - 1,
          },
          this.setTimeout,
        );
      }
    }, 1000);
  };

  speak = () => {
    try {
      const currentWord = this.state.words[this.state.index];
      if (this.state.timerState === "QUIZ") {
        Speech.speak(currentWord.traditional, { language: "zh" });
      } else {
        Speech.speak(currentWord.english, { language: "en" });
      }
    } catch (err) {
      /* Do nothing ~ */
    }
  };

  randomizeDeck = () => {
    this.setState({
      words: knuthShuffle(this.state.lesson),
    });
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  display: "flex",
  alignItems: "center",
  backgroundColor: COLORS.background,
});

const TopSection = glamorous.view({});

const ProgressText = glamorous.text({
  marginTop: 8,
  fontSize: 10,
  textAlign: "center",
});

const Title = glamorous.text({
  fontSize: 18,
  marginTop: 16,
  textAlign: "center",
});

const WordTitle = glamorous.text({
  fontSize: 45,
  fontWeight: "bold",
  textAlign: "center",
});

const AnswerTitle = glamorous.text({
  fontSize: 22,
  textAlign: "center",
});

const WordContainer = glamorous.view({
  marginTop: 25,
  height: 85,
  width: "90%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.lightDark,
});

const AnswerContainer = glamorous.view({
  marginTop: 25,
  height: 75,
  width: "90%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.inactive,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(AudioReviewAllScreen);
