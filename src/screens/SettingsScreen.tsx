import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { Bold } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Colors";
import { APP_DIFFICULTY_SETTING } from "@src/GlobalState";
import {
  convertAppDifficultyToLessonSize,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
} from "@src/tools/utils";

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

class SettingsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: "",
    };
  }

  render(): JSX.Element {
    const { languageSetting } = this.props;
    return (
      <Container>
        <SectionTitle>Language Setting</SectionTitle>
        <Text>
          Your current language setting is:{" "}
          <Bold>{formatUserLanguageSetting(languageSetting)}</Bold>
        </Text>
        <Button
          dark
          mode="contained"
          onPress={this.handleSetLanguageOptions}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Switch to {getAlternateLanguageSetting(languageSetting)} Chinese
        </Button>
        <LineBreak />
        <SectionTitle>App Difficulty Setting</SectionTitle>
        <InfoText>
          Change the number of words per lesson. More words will be harder to
          master, but will reward you with more experience points. You can
          change the difficulty setting at any time.
        </InfoText>
        {[
          APP_DIFFICULTY_SETTING.EASY,
          APP_DIFFICULTY_SETTING.MEDIUM,
          APP_DIFFICULTY_SETTING.HARD,
        ].map(this.renderDifficultyBlock)}
        <LineBreak />
        <SectionTitle>Contact the Developer</SectionTitle>
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
          onPress={this.handleSubmitForm}
          style={{ marginTop: 15, marginBottom: 15 }}
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
    }
  };

  renderDifficultyBlock = (setting: APP_DIFFICULTY_SETTING) => {
    const selected = setting === this.props.appDifficultySetting;
    return (
      <DifficultSettingBlock
        selected={selected}
        onPress={this.setAppDifficulty(setting)}
      >
        <DifficultSettingBlockText selected={selected}>
          Hard ({convertAppDifficultyToLessonSize(setting)} questions per quiz)
        </DifficultSettingBlockText>
        {selected && <Text>✅</Text>}
      </DifficultSettingBlock>
    );
  };

  setAppDifficulty = (setting: APP_DIFFICULTY_SETTING) => () => {
    this.props.handleUpdateAppDifficultySetting(setting);
  };

  handleSetLanguageOptions = () => {
    this.props.handleSwitchLanguage();
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 15,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const SectionTitle = glamorous.text({
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 5,
  marginBottom: 5,
});

const InfoText = glamorous.text({
  marginTop: 5,
  marginBottom: 5,
  width: "80%",
  textAlign: "center",
});

const LineBreak = glamorous.view({
  width: "85%",
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const DifficultSettingBlock = glamorous.touchableOpacity(
  {
    marginTop: 10,
    width: "85%",
    height: 50,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ({ selected }: { selected: boolean }) => ({
    fontWeight: selected ? "500" : "200",
    backgroundColor: selected ? COLORS.primaryBlue : COLORS.lightDark,
  }),
);

const getFontStyle = (selected: boolean): "normal" | "bold" =>
  selected ? "bold" : "normal";

const DifficultSettingBlockText = glamorous.text(
  {},
  ({ selected }: { selected: boolean }) => ({
    fontWeight: getFontStyle(selected),
  }),
);

const TextInputStyles = {
  width: "95%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(SettingsScreen);
