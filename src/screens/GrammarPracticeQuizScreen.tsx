import styled from "@emotion/native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import {
  Button,
  Container,
  ScrollContainer,
  StyledText,
} from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingContext,
} from "@src/providers/SoundRecordingProvider";
import { GrammarScreenParams, Word } from "@src/tools/types";
import { knuthShuffle } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<{}, GrammarScreenParams>;
}

interface IState {
  sentences: Word[];
  index: number;
  completed: number;
  displayFull: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class GrammarPracticeQuizScreenComponent extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const content = this.props.navigation.getParam("content");
    const sentences = knuthShuffle(content);

    const state = {
      sentences,
      index: 0,
      completed: 0,
      displayFull: false,
    };

    return state;
  };

  render(): JSX.Element {
    const { index, completed, sentences } = this.state;
    const item = sentences[index];
    const { languageSetting } = this.props;
    const text = item[languageSetting];
    return (
      <Container style={{ paddingTop: 0 }}>
        <ScrollContainer>
          <WordBox onPress={this.handleReveal}>
            <WordText style={{ fontSize: 44 }}>{text}</WordText>
            {this.state.displayFull ? (
              <React.Fragment>
                <WordText style={{ fontSize: 22 }}>{item.pinyin}</WordText>
                <WordText style={{ fontSize: 22 }}>"{item.english}"</WordText>
              </React.Fragment>
            ) : (
              <WordText
                style={{ fontSize: 20, marginTop: 25, marginBottom: 25 }}
              >
                ...?
              </WordText>
            )}
          </WordBox>
        </ScrollContainer>
        <ControlBox>
          <ProgressText>
            Progress: {completed} / {sentences.length} completed
          </ProgressText>
          <Button onPress={this.handleNext}>Next</Button>
        </ControlBox>
      </Container>
    );
  }

  handleReveal = () => {
    this.setState(ps => ({ ...ps, displayFull: !ps.displayFull }));
  };

  handleNext = () => {
    this.setState(ps => {
      const complete = ps.completed + 1;
      if (complete === ps.sentences.length) {
        this.props.setToastMessage("List completed, reshuffling!");
        return this.getInitialState();
      } else {
        return {
          ...ps,
          index: ps.index + 1,
          completed: complete,
          displayFull: false,
        };
      }
    });
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const ProgressText = styled(StyledText)`
  margin-top: 8;
  font-size: 10;
  text-align: center;
`;

const WordBox = styled.TouchableOpacity<any>`
  width: 100%;
  height: 100%;
  padding-top: 6px;
  padding-right: 12px;
  padding-left: 12px;
  padding-bottom: 135px;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const WordText = styled(StyledText)({
  padding: 4,
  paddingLeft: 8,
  marginTop: 8,
  marginBottom: 8,
});

const ControlBox = styled.View<any>`
  bottom: 0;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 25px;
  padding-bottom: 35px;
  border-top-width: 1px;
  border-top-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.listenBlockDefault : COLORS.fadedText};
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark"
      ? COLORS.backgroundDarkSecondary
      : COLORS.background};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(GrammarPracticeQuizScreenComponent),
);
