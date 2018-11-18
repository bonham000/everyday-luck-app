import glamorous from "glamorous-native";
import React from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  value: string;
  attempted: boolean;
  valid: boolean;
}

export default class Home extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: "",
      attempted: false,
      valid: false,
    };
  }

  render(): JSX.Element {
    const { valid, attempted } = this.state;
    return (
      <Container>
        <Text style={{ fontSize: 20, marginTop: 12, fontWeight: "bold" }}>
          "I am"
        </Text>
        <TextInput
          style={{
            width: "95%",
            marginTop: 12,
          }}
          mode="outlined"
          label="Translate to Mandarin"
          value={this.state.value}
          onChangeText={(value: string) => this.setState({ value })}
        />
        <Button
          mode="contained"
          style={{ marginTop: 25 }}
          onPress={this.handleCheck}
        >
          Proceed
        </Button>
        {valid ? (
          <Text style={{ fontSize: 20, marginTop: 12 }}>Correct!</Text>
        ) : attempted ? (
          <Text style={{ fontSize: 20, marginTop: 12 }}>
            Wrong, keep trying!
          </Text>
        ) : null}
      </Container>
    );
  }

  handleCheck = () => {
    if (this.state.value === "我是") {
      this.setState({
        attempted: true,
        valid: true,
      });
    } else {
      this.setState({
        attempted: true,
        valid: false,
      });
    }
  };
}

const Container = glamorous.view({
  flex: 1,
  paddingTop: 8,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});
