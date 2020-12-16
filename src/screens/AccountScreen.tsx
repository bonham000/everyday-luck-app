import styled from "@emotion/native";
import React from "react";
import { Alert } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import {
  Button,
  ScrollContainer,
  StyledText,
  StyledTextInput,
} from "@src/components/SharedComponents";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { logoutUserLocal } from "@src/tools/async-store";
import { convertAppDifficultyToLessonSize } from "@src/tools/utils";
import MOCKS from "@tests/mocks";
import { NativeStyleThemeProps } from "@src/AppContainer";
import { COLORS } from "@src/constants/Theme";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  numberOfLessonsCompleted: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class AccountScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      numberOfLessonsCompleted: "",
    };
  }

  render(): JSX.Element {
    return (
      <ScrollContainer>
        {/* {this.renderManuallySetScoresSection()} */}
        <SectionTitle>Reset Scores</SectionTitle>
        <InfoText>
          This will reset your score history and you will have to start over.
        </InfoText>
        <Button
          onPress={this.resetProgress}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Reset Score History
        </Button>
        {/* <LineBreak />
        <SectionTitle>Clear Account Data</SectionTitle>
        <InfoText>This will clear and reset your account data.</InfoText>
        <Button
          onPress={this.clearUserDataOnDevice}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Clear Account Data
        </Button> */}
        <LineBreak />
        <SectionTitle>Complete All Lessons</SectionTitle>
        <InfoText>
          Forcibly unlock all the app lessons. Warning this defeats the purpose
          of the app as a learning tool! You can undo this at any time by
          resetting your scores again on this screen.
        </InfoText>
        <Button
          onPress={this.setCompletedScore}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Complete Lessons
        </Button>
      </ScrollContainer>
    );
  }

  renderManuallySetScoresSection = () => {
    /**
     * NOTE: Enable this if you need to render this UI to manually
     * set user scores at some point in the future.
     */
    return (
      <React.Fragment>
        <SectionTitle>Manually Set Scores</SectionTitle>
        <InfoText>
          Override your current progress. Enter a number of lessons you wish to
          have completed.
        </InfoText>
        <StyledTextInput
          mode="outlined"
          value={this.state.numberOfLessonsCompleted}
          onChangeText={this.handleChangeNumberOfLessons}
          onSubmitEditing={this.dangerouslySetUserScoresManuallyAsync}
          label="Set a number of lessons completed"
        />
        <Button
          onPress={this.dangerouslySetUserScoresManuallyAsync}
          style={{ marginTop: 25, marginBottom: 15 }}
        >
          Set Scores
        </Button>
        <LineBreak />
      </React.Fragment>
    );
  };

  handleChangeNumberOfLessons = (numberOfLessonsCompleted: string) => {
    this.setState({
      numberOfLessonsCompleted,
    });
  };

  resetProgress = async () => {
    Alert.alert(
      "Are you sure?",
      "This will reset your progress and you will have to start over again.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            await this.props.setLessonScore(MOCKS.DEFAULT_SCORE_STATE, 0);
            this.props.setToastMessage("Score reset!");
            this.props.navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
  };

  clearUserDataOnDevice = async () => {
    Alert.alert(
      "Are you sure?",
      "This will clear all your data and your account may be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            await logoutUserLocal();
            this.props.setToastMessage("Data cleared");
          },
        },
      ],
      { cancelable: false },
    );
  };

  dangerouslySetUserScoresManuallyAsync = () => {
    const numberOfLessonsCompleted = Number(
      this.state.numberOfLessonsCompleted,
    );

    if (isNaN(numberOfLessonsCompleted)) {
      return this.props.setToastMessage("Please enter a number value");
    }

    Alert.alert(
      "Are you sure?",
      "This will clear your existing progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            const quizSize = convertAppDifficultyToLessonSize(
              this.props.appDifficultySetting,
            );

            const numberOfWords = quizSize * numberOfLessonsCompleted;
            const scores = this.props.user!.score_history;
            const newScores = {
              ...scores,
              list_02_score: {
                list_key: "2",
                list_index: 0,
                complete: false,
                number_words_completed: numberOfWords,
                mc_english: false,
                mc_mandarin: false,
                quiz_text: false,
                mandarin_pronunciation: false,
              },
            };

            await this.props.setLessonScore(newScores, 1243);
            this.props.setToastMessage("Done!");
          },
        },
      ],
      { cancelable: false },
    );
  };

  setCompletedScore = () => {
    Alert.alert(
      "Are you sure?",
      "You can undo this at any time by choosing to reset your scores on this screen.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            await this.props.setLessonScore(MOCKS.COMPLETED_SCORE_STATE, 10000);
            this.props.setToastMessage("All Lessons Completed!");
            this.props.navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const SectionTitle = styled(StyledText)({
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5,
  marginBottom: 5,
});

const LineBreak = styled.View<any>`
  width: 85%;
  margin-top: 12px;
  margin-left: 12px;
  margin-bottom: 6px;
  height: 1px;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.dark};
`;

const InfoText = styled(StyledText)({
  marginTop: 5,
  marginBottom: 5,
  width: "80%",
  textAlign: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(AccountScreenComponent);
