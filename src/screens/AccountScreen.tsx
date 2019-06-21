import glamorous from "glamorous-native";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  Button,
  ScrollContainer,
} from "@src/components/SharedComponents";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { logoutUserLocal } from "@src/tools/async-store";
import { convertAppDifficultyToLessonSize } from "@src/tools/utils";
import MOCKS from "@tests/mocks";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  accountUuid: string;
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
      accountUuid: "",
      numberOfLessonsCompleted: "",
    };
  }

  render(): JSX.Element {
    const { accountUuid } = this.state;
    const uuid = this.props.user ? this.props.user.uuid : "";
    return (
      <ScrollContainer>
        <SectionTitle>Account ID</SectionTitle>
        <InfoText>
          If you transfer to a new phone you can use this account ID to restore
          your progress on the other device.
        </InfoText>
        <Bold>{uuid}</Bold>
        <Button
          style={{ marginTop: 15, marginBottom: 15 }}
          onPress={() => (uuid ? this.props.copyToClipboard(uuid) : null)}
        >
          Copy ID
        </Button>
        <LineBreak />
        <SectionTitle>Transfer Account</SectionTitle>
        <InfoText>
          Enter another account ID here to restore that account.
        </InfoText>
        <TextInput
          mode="outlined"
          value={accountUuid}
          style={TextInputStyles}
          onChangeText={this.handleChangeAccountUuid}
          onSubmitEditing={this.handleTransferAccount}
          label="Enter account id to recover account"
        />
        <Button
          onPress={this.handleTransferAccount}
          style={{ marginTop: 25, marginBottom: 15 }}
        >
          Transfer Account
        </Button>
        <LineBreak />
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
        <LineBreak />
        <SectionTitle>Clear Account Data</SectionTitle>
        <InfoText>This will clear and reset your account data.</InfoText>
        <Button
          onPress={this.clearUserDataOnDevice}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Clear Account Data
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
        <TextInput
          mode="outlined"
          style={TextInputStyles}
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

  handleChangeAccountUuid = (accountUuid: string) => {
    this.setState({ accountUuid });
  };

  handleChangeNumberOfLessons = (numberOfLessonsCompleted: string) => {
    this.setState({
      numberOfLessonsCompleted,
    });
  };

  handleTransferAccount = () => {
    const { accountUuid } = this.state;

    if (!accountUuid) {
      return this.props.setToastMessage("Please enter an ID");
    } else if (this.props.user && this.props.user.uuid === accountUuid) {
      return this.props.setToastMessage("ID matches your current user already");
    }

    Alert.alert(
      "Are you sure?",
      "This will change your account to the submitted ID. Any current progress on this account may be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: () => {
            this.props.transferUserAccount(accountUuid);
            this.setState({ accountUuid: "" }, this.props.navigation.goBack);
          },
        },
      ],
      { cancelable: false },
    );
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
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const SectionTitle = glamorous.text({
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5,
  marginBottom: 5,
});

const LineBreak = glamorous.view({
  width: "85%",
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const TextInputStyles = {
  width: "90%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

const InfoText = glamorous.text({
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
