import styled from "@emotion/native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import {
  Button,
  Container,
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
import { SentenceScreenParams, Word } from "@src/tools/types";
import { knuthShuffle } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<{}, SentenceScreenParams>;
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

export class SentencesPracticeQuizScreenComponent extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const content = this.props.navigation.getParam("sentences");
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
      <Container>
        <WordBox onPress={this.handleReveal}>
          <WordText style={{ fontSize: 44 }}>{text}</WordText>
          {this.state.displayFull ? (
            <React.Fragment>
              <WordText style={{ fontSize: 22 }}>{item.pinyin}</WordText>
              <WordText style={{ fontSize: 22 }}>"{item.english}"</WordText>
            </React.Fragment>
          ) : (
            <WordText style={{ fontSize: 20, marginTop: 25, marginBottom: 25 }}>
              ...?
            </WordText>
          )}
        </WordBox>
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
  padding: 8px;
  width: 100%;
  height: 100%;
  padding-left: 12px;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const WordText = styled(StyledText)({
  padding: 4,
  paddingLeft: 8,
  marginTop: 8,
  marginBottom: 8,
});

const ControlBox = styled.View`
  bottom: 0;
  position: absolute;
  padding-top: 25px;
  padding-bottom: 45px;
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(SentencesPracticeQuizScreenComponent),
);
