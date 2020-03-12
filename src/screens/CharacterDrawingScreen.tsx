import { Sketch } from "expo-pixi";
import glamorous from "glamorous-native";
import React from "react";
import { Alert } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import { BasicContainer } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import { APP_LANGUAGE_SETTING } from "@src/providers/GlobalStateContext";
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

interface IState {
  index: number;
  completed: number;
  lesson: Lesson;
  deck: Lesson;
  reveal: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class CharacterDrawingScreenComponent extends React.Component<
  IProps,
  IState
> {
  sketch: any = null;

  constructor(props: IProps) {
    super(props);

    const lesson = this.props.navigation.getParam("lesson");

    // Limit character drawing to only 1 or 2 character words
    const oneOrTwoCharacters = lesson.filter(w => w.traditional.length < 2);
    console.log(oneOrTwoCharacters);

    this.state = {
      reveal: false,
      index: 0,
      completed: 0,
      lesson: oneOrTwoCharacters,
      deck: knuthShuffle(oneOrTwoCharacters),
    };
  }

  render(): JSX.Element {
    const { deck, reveal, index, completed } = this.state;
    const word = deck[index];

    const language = this.props.languageSetting;
    const character =
      language === APP_LANGUAGE_SETTING.SIMPLIFIED
        ? word.simplified
        : word.traditional;

    const width = 20;
    const alpha = 0.85;
    const color = "#0f0f0e";

    return (
      <BasicContainer>
        <ProgressText>
          Progress: {completed} / {deck.length} completed
        </ProgressText>
        <CharacterHint>
          {word.pinyin} {word.english}
        </CharacterHint>
        {reveal ? (
          <CharacterContainer>
            <Character>{character}</Character>
          </CharacterContainer>
        ) : (
          <Sketch
            style={{ flex: 8 }}
            strokeColor={color}
            strokeWidth={width}
            strokeAlpha={alpha}
            ref={this.assignSketchRef}
          />
        )}
        <Controls>
          {reveal ? (
            <Control
              onPress={this.handleProceed}
              style={{ backgroundColor: COLORS.actionButtonBlue }}
            >
              <ControlText>Next Character</ControlText>
            </Control>
          ) : (
            <Control
              onPress={this.undoSketchLine}
              style={{ backgroundColor: COLORS.actionButtonYellow }}
            >
              <ControlText>Undo Stroke</ControlText>
            </Control>
          )}
          <Control
            onPress={this.handleReveal}
            style={{ backgroundColor: COLORS.actionButtonMint }}
          >
            <ControlText>{reveal ? "Draw" : "Reveal"}</ControlText>
          </Control>
        </Controls>
      </BasicContainer>
    );
  }

  undoSketchLine = () => {
    if (this.sketch) {
      this.sketch.undo();
    }
  };

  handleProceed = () => {
    if (this.state.index === this.state.deck.length) {
      return this.handleFinish();
    } else {
      this.setState(ps => ({
        reveal: false,
        index: ps.index + 1,
        completed: ps.completed + 1,
      }));
    }
  };

  handleReveal = () => {
    this.setState(ps => ({ reveal: !ps.reveal }));
  };

  randomizeDeck = () => {
    this.setState({ deck: knuthShuffle(this.state.lesson) });
  };

  handleFinish = () => {
    this.setState(
      {
        deck: [],
        completed: 0,
      },
      () => {
        Alert.alert(
          "You finished all the words!!! 🎉🎉🎉",
          "The deck will be shuffled and restarted now.",
          [
            {
              text: "OK!",
              onPress: this.randomizeDeck,
            },
          ],
          { cancelable: false },
        );
      },
    );
  };

  assignSketchRef = (ref: any) => {
    // tslint:disable-next-line
    this.sketch = ref;
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const ProgressText = glamorous.text({
  marginTop: 8,
  fontSize: 10,
  textAlign: "center",
});

const CharacterHint = glamorous.text({
  marginTop: 10,
  fontSize: 25,
  textAlign: "center",
});

const CharacterContainer = glamorous.view({
  flex: 8,
  alignItems: "center",
  justifyContent: "center",
});

const Character = glamorous.text({
  fontSize: 125,
});

const Controls = glamorous.view({
  flex: 1,
  backgroundColor: COLORS.actionButtonYellow,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
});

const Control = glamorous.touchableOpacity({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});

const ControlText = glamorous.text({
  fontSize: 18,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(CharacterDrawingScreenComponent);
