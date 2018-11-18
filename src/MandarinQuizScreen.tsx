import glamorous from "glamorous-native";
import React from "react";
import Confetti from "react-native-confetti";
import { Button, Text, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { PRIMARY_BLUE, PRIMARY_RED } from "../App";
import Shaker from "./Shaker";
import WORDS from "./WordSource";

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  value: string;
  attempted: boolean;
  valid: boolean;
  currentWordIndex: number;
  shouldShake: boolean;
  wordCompletedCache: Set<number>;
  encouragementText: string;
  progressCount: number;
}

export default class Home extends React.Component<IProps, IState> {
  CONFETTI_REF: any = null;
  INPUT_REF: any = null;
  timer: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      value: "",
      attempted: false,
      valid: false,
      shouldShake: false,
      currentWordIndex: 0,
      wordCompletedCache: new Set(),
      encouragementText: "",
      progressCount: 0,
    };
  }

  componentDidMount(): void {
    const currentWordIndex = this.getNextWordIndex();
    this.setState(
      {
        currentWordIndex: this.getNextWordIndex(),
        wordCompletedCache: new Set([currentWordIndex]),
      },
      this.focusInput,
    );
  }

  componentWillUnmount(): void {
    this.stopConfetti();
  }

  render(): JSX.Element {
    const {
      valid,
      attempted,
      shouldShake,
      progressCount,
      currentWordIndex,
      encouragementText,
    } = this.state;
    const CURRENT_WORD = WORDS[currentWordIndex];

    return (
      <Container>
        <Confetti untilStopped duration={1500} ref={this.setConfettiRef} />
        <ProgressText>
          Progress: {progressCount} word
          {progressCount === 1 ? "" : "s"} completed ({WORDS.length} total)
        </ProgressText>
        {valid ? (
          <QuizBox>
            <MandarinText>{CURRENT_WORD.mandarin}</MandarinText>
            <PinyinText>{CURRENT_WORD.pinyin}</PinyinText>
          </QuizBox>
        ) : (
          <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
            <QuizBox>
              <EnglishText>"{CURRENT_WORD.english}"</EnglishText>
              <TextInput
                mode="outlined"
                error={attempted}
                ref={this.setInputRef}
                style={TextInputStyles}
                value={this.state.value}
                onChangeText={this.handleChange}
                onSubmitEditing={this.handleCheck}
                label="Translate the English to Mandarin please"
              />
            </QuizBox>
          </Shaker>
        )}
        <Button
          dark
          mode="contained"
          style={{
            marginTop: 25,
            backgroundColor: !valid && attempted ? PRIMARY_RED : PRIMARY_BLUE,
          }}
          onPress={valid ? this.handleProceed : this.handleCheck}
        >
          {valid
            ? `✨ ${
                COMPLIMENTS[randomInRange(0, COMPLIMENTS.length - 1)]
              }! Next! ✨`
            : attempted
              ? `${encouragementText}! Keep trying! 🙏`
              : "Check answer 👲"}
        </Button>
      </Container>
    );
  }

  handleChange = (value: string) => {
    this.setState({
      value,
      shouldShake: false,
    });
  };

  handleCheck = () => {
    if (this.state.value) {
      const CURRENT_WORD = WORDS[this.state.currentWordIndex];
      if (this.state.value === CURRENT_WORD.mandarin) {
        this.setState(prevState => {
          return {
            valid: true,
            attempted: true,
            progressCount: prevState.progressCount + 1,
          };
        }, this.makeItRain);
      } else {
        this.setState({
          attempted: true,
          valid: false,
          shouldShake: true,
          encouragementText:
            ENCOURAGEMENTS[randomInRange(0, ENCOURAGEMENTS.length - 1)],
        });
      }
    }
  };

  handleProceed = () => {
    this.setState(
      prevState => {
        const nextIndex = this.getNextWordIndex();

        return {
          value: "",
          valid: false,
          attempted: false,
          currentWordIndex: nextIndex,
          wordCompletedCache: prevState.wordCompletedCache.add(nextIndex),
        };
      },
      () => {
        this.stopConfetti();
        this.focusInput();
      },
    );
  };

  getNextWordIndex = (): number => {
    const { wordCompletedCache } = this.state;
    const nextWordIndex = this.getRandomWordIndex();
    if (!wordCompletedCache.has(nextWordIndex)) {
      return nextWordIndex;
    } else {
      return this.getNextWordIndex();
    }
  };

  getRandomWordIndex = (): number => {
    return randomInRange(0, WORDS.length - 1);
  };

  setConfettiRef = (node: any) => {
    // @ts-ignore
    this.CONFETTI_REF = node;
  };

  makeItRain = () => {
    if (this.CONFETTI_REF) {
      this.CONFETTI_REF.startConfetti();
    }
  };

  stopConfetti = () => {
    if (this.CONFETTI_REF) {
      this.CONFETTI_REF.stopConfetti();
    }
  };

  setInputRef = (ref: any) => {
    // @ts-ignore
    this.INPUT_REF = ref;
  };

  focusInput = () => {
    if (this.INPUT_REF) {
      this.INPUT_REF.focus();
    }
  };
}

const Container = glamorous.view({
  flex: 1,
  paddingTop: 8,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const ProgressText = glamorous.text({
  position: "absolute",
  left: 5,
  top: 5,
  fontSize: 10,
});

const QuizBox = glamorous.view({
  marginTop: 25,
  height: 125,
  width: "100%",
  alignItems: "center",
});

const TextInputStyles = {
  width: "95%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

const EnglishText = ({ children }: { children: string[] }) => (
  <Text
    style={{
      fontSize: 20,
      marginTop: 15,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const MandarinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 40,
      marginTop: 15,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const PinyinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 22,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const COMPLIMENTS = [
  "Amazing",
  "Awesome",
  "Blithesome",
  "Excellent",
  "Fabulous",
  "Fantastic",
  "Favorable",
  "Fortuitous",
  "Gorgeous",
  "Incredible",
  "Ineffable",
  "Mirthful",
  "Outstanding",
  "Perfect",
  "Propitious",
  "Remarkable",
  "Rousing",
  "Spectacular",
  "Splendid",
  "Stellar",
  "Stupendous",
  "Super",
  "Upbeat",
  "Unbelievable",
  "Wondrous",
];

const ENCOURAGEMENTS = [
  "No good",
  "Nope",
  "Too bad",
  "So close",
  "Almost",
  "One more time",
  "Nearly",
];
