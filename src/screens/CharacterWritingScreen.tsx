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
  completed: number;
  lesson: Lesson;
  deck: Lesson;
  reveal: boolean;
  renderNull: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class CharacterWritingScreenComponent extends React.Component<
  IProps,
  IState
> {
  sketch: any = null;

  constructor(props: IProps) {
    super(props);

    const lesson = this.props.navigation.getParam("lesson");

    // Limit character drawing to only 1 or 2 character words
    const oneOrTwoCharacters = lesson.filter(w => w.traditional.length <= 2);

    this.state = {
      renderNull: false,
      reveal: false,
      completed: 0,
      lesson: oneOrTwoCharacters,
      deck: knuthShuffle(oneOrTwoCharacters),
    };
  }

  render(): JSX.Element | null {
    const { deck, reveal, lesson, completed, renderNull } = this.state;

    // This is shit we all know it!
    if (renderNull) {
      return null;
    }

    const word = deck[0];

    const language = this.props.languageSetting;
    const character =
      language === APP_LANGUAGE_SETTING.SIMPLIFIED
        ? word.simplified
        : word.traditional;

    // Sketch configuration settings
    const width = 25;
    const alpha = 1;
    const color = COLORS.dark;

    return (
      <BasicContainer>
        <ProgressText>
          Progress: {completed} / {lesson.length} completed
        </ProgressText>
        <CharacterHint>
          {word.pinyin} <Italic>"{word.english}"</Italic>
        </CharacterHint>
        {reveal && (
          <CharacterContainer>
            <Character style={{ marginBottom: 24 }}>{character}</Character>
          </CharacterContainer>
        )}
        <Sketch
          style={{ flex: 1 }}
          strokeColor={color}
          strokeWidth={width}
          strokeAlpha={alpha}
          ref={this.assignSketchRef}
        />
        {reveal ? (
          <Controls>
            <Control
              onPress={this.handleProceedWithRetry}
              style={{ backgroundColor: COLORS.actionButtonYellow }}
            >
              <ControlText>Retry Word</ControlText>
            </Control>
            <Control
              onPress={this.handleToggleReveal}
              style={{ backgroundColor: COLORS.actionButtonMint }}
            >
              <ControlText>Draw</ControlText>
            </Control>
            <Control
              onPress={this.handleProceed}
              style={{ backgroundColor: COLORS.actionButtonBlue }}
            >
              <ControlText>Next</ControlText>
            </Control>
          </Controls>
        ) : (
          <Controls>
            <Control
              onPress={this.undoSketchLine}
              style={{ backgroundColor: COLORS.actionButtonYellow }}
            >
              <ControlText>Undo Stroke</ControlText>
            </Control>
            <Control
              onPress={this.handleToggleReveal}
              style={{ backgroundColor: COLORS.actionButtonMint }}
            >
              <ControlText>Reveal</ControlText>
            </Control>
            <Control
              onPress={this.handleProceed}
              style={{ backgroundColor: COLORS.actionButtonBlue }}
            >
              <ControlText>Next</ControlText>
            </Control>
          </Controls>
        )}
      </BasicContainer>
    );
  }

  undoSketchLine = () => {
    if (this.sketch) {
      this.sketch.undo();
    }
  };

  handleProceed = () => {
    if (this.state.completed === this.state.lesson.length - 1) {
      return this.handleFinish();
    } else {
      // Suck it expo-pixi .clear method, yeah - that's right!!!
      this.setState(
        {
          renderNull: true,
        },
        () => {
          this.setState(ps => ({
            renderNull: false,
            reveal: false,
            deck: ps.deck.slice(1),
            completed: ps.completed + 1,
          }));
        },
      );
    }
  };

  handleProceedWithRetry = () => {
    // Suck it expo-pixi .clear method, yeah - that's right!!!
    this.setState(
      {
        renderNull: true,
      },
      () => {
        this.setState(ps => {
          return {
            renderNull: false,
            reveal: false,
            deck: knuthShuffle(ps.deck),
          };
        });
      },
    );
  };

  handleToggleReveal = () => {
    this.setState(ps => ({ reveal: !ps.reveal }));
  };

  resetWritingQuiz = () => {
    this.setState(
      {
        reveal: false,
        renderNull: false,
        deck: knuthShuffle(this.state.lesson),
      },
      () => {
        this.props.setToastMessage("Reset to the beginning!");
      },
    );
  };

  handleFinish = () => {
    this.setState(
      {
        deck: [],
        completed: 0,
        renderNull: true,
      },
      () => {
        Alert.alert(
          "You finished all the words!!! 🎉🎉🎉",
          "The deck will be shuffled and restarted now.",
          [
            {
              text: "OK!",
              onPress: this.resetWritingQuiz,
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

const CONTROLS_HEIGHT = 75;

const ProgressText = glamorous.text({
  marginTop: 8,
  fontSize: 10,
  textAlign: "center",
});

const CharacterHint = glamorous.text({
  marginTop: 10,
  fontSize: 20,
  textAlign: "center",
});

const Italic = glamorous.text({
  fontStyle: "italic",
});

const CharacterContainer = glamorous.view({
  position: "absolute",
  top: 0,
  right: 0,
  left: 0,
  bottom: CONTROLS_HEIGHT,
  flex: 1,
  zIndex: 10,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(231, 237, 240, 0.85)",
});

const Character = glamorous.text({
  fontSize: 175,
});

const Controls = glamorous.view({
  height: CONTROLS_HEIGHT,
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

export default withGlobalStateContext(CharacterWritingScreenComponent);
