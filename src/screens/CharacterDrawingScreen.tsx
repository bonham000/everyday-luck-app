import { PIXI } from "expo-pixi";
import glamorous from "glamorous-native";
import React from "react";
import { Alert } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import { BasicContainer } from "@src/components/SharedComponents";
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
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class CharacterDrawingScreenComponent extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);

    const lesson = this.props.navigation.getParam("lesson");

    // Limit character drawing to only 1 or 2 character words
    const oneOrTwoCharacters = lesson.filter(w => w.traditional.length > 2);

    this.state = {
      completed: 0,
      lesson: oneOrTwoCharacters,
      deck: knuthShuffle(oneOrTwoCharacters),
    };
  }

  render(): JSX.Element {
    const color = "0x0000ff";
    const width = 5;
    const alpha = 0.5;

    // TODO:
    // Create sketch space
    // Create controls to flip card
    // Render character on reverse side

    return (
      <BasicContainer>
        <ExpoPixi.Sketch
          strokeColor={color}
          strokeWidth={width}
          strokeAlpha={alpha}
        />
        {/* <ProgressText>
          Progress: {this.state.completed} / {this.state.lesson.length}{" "}
          completed
        </ProgressText> */}
      </BasicContainer>
    );
  }

  randomizeDeck = () => {
    this.setState({
      deck: knuthShuffle(this.state.lesson),
    });
  };

  handleSwipe = (direction: "left" | "right") => (cardIndex: number) => {
    const { deck, completed } = this.state;

    let newDeck: Lesson;
    if (direction === "left") {
      if (cardIndex === deck.length - 2) {
        newDeck = [
          ...deck.slice(0, cardIndex + 1),
          deck[cardIndex + 1],
          deck[cardIndex],
        ];
      } else {
        const reshuffledDeckSlice = knuthShuffle([
          ...deck.slice(cardIndex + 1),
          deck[cardIndex],
        ]);

        if (cardIndex === deck.length - 1 && completed > 0) {
          newDeck = reshuffledDeckSlice;
        } else {
          newDeck = [...deck.slice(0, cardIndex + 1), ...reshuffledDeckSlice];
        }
      }
    } else {
      newDeck = deck;
    }

    const inc = direction === "right" ? 1 : 0;
    const finished = completed + inc;

    if (finished === this.state.lesson.length) {
      return this.handleFinish();
    }

    this.setState({
      deck: newDeck,
      completed: finished,
    });
  };

  handleFinish = () => {
    this.setState(
      {
        deck: [],
        completed: 0,
      },
      () => {
        Alert.alert(
          "You finished all the flashcards!!! 🎉",
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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(CharacterDrawingScreenComponent);
