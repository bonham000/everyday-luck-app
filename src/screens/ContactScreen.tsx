import glamorous from "glamorous-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { COLORS } from "@src/constants/Colors";
import {
  GlobalStateProps,
  withGlobalState,
} from "@src/providers/GlobalStateProvider";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  input: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class ContactScreen extends React.Component<IProps, IState> {
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

const Container = glamorous.view({
  flex: 1,
  paddingTop: 25,
  alignItems: "center",
  backgroundColor: COLORS.wordCardBackground,
});

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
  backgroundColor: "rgb(231,237,240)",
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(ContactScreen);
