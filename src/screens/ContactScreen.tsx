import glamorous from "glamorous-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { Button, Container } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { sendContactRequest } from "@src/tools/api";
import { isEmailValid } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  message: string;
  contactEmail: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class ContactScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      message: "",
      contactEmail: "",
    };
  }

  render(): JSX.Element {
    return (
      <Container>
        <SectionTitle>Contact</SectionTitle>
        <InfoText>
          Found a bug, have feedback, or just want to say hello? Get in touch
          with the developer by sending a quick message here. Please leave your
          email so we can reply to your feedback, if needed.
        </InfoText>
        <TextInput
          multiline
          mode="outlined"
          label="Type a message"
          style={TextInputStyles}
          value={this.state.message}
          onChangeText={this.handleFieldChange("message")}
        />
        <TextInput
          multiline
          mode="outlined"
          label="Please add a contact email"
          style={TextInputStyles}
          value={this.state.contactEmail}
          onChangeText={this.handleFieldChange("contactEmail")}
        />
        <Button style={{ marginTop: 35 }} onPress={this.handleSubmitForm}>
          Submit Feedback
        </Button>
      </Container>
    );
  }

  handleFieldChange = (field: "message" | "contactEmail") => (
    value: string,
  ) => {
    this.setState(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  handleSubmitForm = () => {
    const { message, contactEmail } = this.state;
    if (message === "") {
      return this.props.setToastMessage("Please enter a message");
    } else if (contactEmail === "" || !isEmailValid(contactEmail)) {
      return this.props.setToastMessage("Please enter a valid email address");
    }

    this.setState(
      {
        message: "",
        contactEmail: "",
      },
      async () => {
        await sendContactRequest(contactEmail, message);
        this.props.setToastMessage(
          "Message sent, thank you for the feedback!!!",
        );
      },
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

const InfoText = glamorous.text({
  marginTop: 12,
  marginBottom: 12,
  width: "80%",
  textAlign: "center",
});

const TextInputStyles = {
  width: "90%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: COLORS.background,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(ContactScreenComponent);
