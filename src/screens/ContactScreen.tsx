import styled from "@emotion/native";
import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import {
  Button,
  Container,
  StyledText,
  StyledTextInput,
} from "@src/components/SharedComponents";
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container>
          <SectionTitle>Contact</SectionTitle>
          <InfoText>
            Found a bug, have feedback, or just want to say hello? Get in touch
            with the developer by sending a quick message here. Please leave
            your email so we can reply to your feedback, if needed.
          </InfoText>
          <StyledTextInput
            multiline
            label="Type a message"
            theme={this.props.appTheme}
            value={this.state.message}
            handleChange={this.handleFieldChange("message")}
          />
          <StyledTextInput
            multiline
            theme={this.props.appTheme}
            label="Please add a contact email"
            value={this.state.contactEmail}
            handleChange={this.handleFieldChange("contactEmail")}
          />
          <Button style={{ marginTop: 35 }} onPress={this.handleSubmitForm}>
            Submit Feedback
          </Button>
        </Container>
      </TouchableWithoutFeedback>
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
    this.props.handleSendContactEmail(contactEmail, message, () => {
      this.setState(
        {
          message: "",
          contactEmail: "",
        },
        this.props.navigation.goBack,
      );
    });
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

const InfoText = styled(StyledText)({
  marginTop: 12,
  marginBottom: 12,
  width: "80%",
  textAlign: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(ContactScreenComponent);
