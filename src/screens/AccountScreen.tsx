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

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  accountUuid: string;
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
          onChangeText={this.handleChange}
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
        <SectionTitle>Clear Data</SectionTitle>
        <InfoText>This will reset your progress.</InfoText>
        <Button
          onPress={this.clearUserDataOnDevice}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Clear Score History
        </Button>
      </ScrollContainer>
    );
  }

  handleChange = (accountUuid: string) => {
    this.setState({ accountUuid });
  };

  handleTransferAccount = () => {
    if (!this.state.accountUuid) {
      return this.props.setToastMessage("Please enter an ID");
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
            this.props.transferUserAccount(this.state.accountUuid);
            this.setState({ accountUuid: "" }, this.props.navigation.goBack);
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

  dangerouslySetUserScoresManuallyAsync = async () => {
    const scores = this.props.user!.score_history;
    const newScores = {
      ...scores,
      list_02_score: {
        list_key: "2",
        list_index: 0,
        complete: false,
        number_words_completed: 130,
      },
    };

    await this.props.setLessonScore(newScores, 1243);
    this.props.setToastMessage("Done!");
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
