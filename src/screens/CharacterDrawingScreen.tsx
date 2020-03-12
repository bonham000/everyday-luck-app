import { Sketch } from "expo-pixi";
import glamorous from "glamorous-native";
import React from "react";
import { Alert } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import { BasicContainer } from "@src/components/SharedComponents";
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

interface IState {
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
    const oneOrTwoCharacters = lesson.filter(w => w.traditional.length > 2);

    this.state = {
      reveal: false,
      completed: 0,
      lesson: oneOrTwoCharacters,
      deck: knuthShuffle(oneOrTwoCharacters),
    };
  }

  render(): JSX.Element {
    const { reveal } = this.state;

    if (reveal) {
      return <BasicContainer />;
    }

    const width = 20;
    const alpha = 0.85;
    const color = "#0f0f0e";

    return (
      <BasicContainer>
        <ProgressText>
          Progress: {this.state.completed} / {this.state.lesson.length}{" "}
          completed
        </ProgressText>
        <Sketch
          style={{ flex: 8 }}
          strokeColor={color}
          strokeWidth={width}
          strokeAlpha={alpha}
          ref={this.assignSketchRef}
        />
        <Controls>
          <Control
            disabled={reveal}
            onPress={this.undoSketchLine}
            style={{ backgroundColor: COLORS.actionButtonBlue }}
          >
            <ControlText>Reset</ControlText>
          </Control>
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
    console.log(Object.keys(ref));
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

const Controls = glamorous.view({
  flex: 1,
  backgroundColor: "pink",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
});

const Control = glamorous.touchableOpacity({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.actionButtonYellow,
});

const ControlText = glamorous.text({
  fontSize: 20,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(CharacterDrawingScreenComponent);
