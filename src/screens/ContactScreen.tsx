import glamorous from "glamorous-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { Container } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
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
  input: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class ContactScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: "",
    };
  }

  render(): JSX.Element {
    return (
      <Container>
        <SectionTitle>Contact</SectionTitle>
        <InfoText>
          Found a bug, have feedback, or just want to say hello? Get in touch
          with the developer by sending a quick message here.
        </InfoText>
        <TextInput
          multiline
          mode="outlined"
          value={this.state.input}
          style={TextInputStyles}
          onChangeText={this.handleChange}
          label="Type a message"
          onSubmitEditing={this.handleSubmitForm}
        />
        <Button
          dark
          mode="contained"
          style={{ marginTop: 35 }}
          onPress={this.handleSubmitForm}
        >
          Submit Feedback
        </Button>
      </Container>
    );
  }

  handleChange = (input: string) => {
    this.setState({ input });
  };

  handleSubmitForm = () => {
    if (this.state.input) {
      /**
       * TODO: Implement sending message.
       */
      this.setState(
        {
          input: "",
        },
        () => {
          this.props.setToastMessage(
            "Message sent, thank you for the feedback! You should expect a reply in a few days time.",
          );
        },
      );
    } else {
      this.props.setToastMessage("Please enter a message");
    }
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
