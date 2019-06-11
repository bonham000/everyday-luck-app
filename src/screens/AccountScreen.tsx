import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { Button, ScrollContainer } from "@src/components/SharedComponents";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";

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
    const uuid = this.props.user && this.props.user.uuid;
    return (
      <ScrollContainer>
        <SectionTitle>Transfer Account</SectionTitle>
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
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Transfer Account
        </Button>
        <LineBreak />
        <SectionTitle>Account ID</SectionTitle>
        <InfoText>{}</InfoText>
        <Button
          style={{ marginTop: 15, marginBottom: 15 }}
          onPress={() => (uuid ? this.props.copyToClipboard(uuid) : null)}
        >
          Copy ID
        </Button>
      </ScrollContainer>
    );
  }

  handleChange = (accountUuid: string) => {
    this.setState({ accountUuid });
  };

  handleTransferAccount = () => {
    this.props.transferUserAccount(this.state.accountUuid);
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
