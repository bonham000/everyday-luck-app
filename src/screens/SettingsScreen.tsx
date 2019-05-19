import glamorous from "glamorous-native";
import React from "react";
import { Button, Text } from "react-native-paper";
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
import { StyleSheet } from "react-native";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class SettingsScreen extends React.Component<IProps, {}> {
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
        <DifficultyText>
          Change the number of words per lesson. More words will be harder to
          master, but will reward you with more experience points. You can
          change the difficulty setting at any time.
        </DifficultyText>
        {[
          APP_DIFFICULTY_SETTING.EASY,
          APP_DIFFICULTY_SETTING.MEDIUM,
          APP_DIFFICULTY_SETTING.HARD,
        ].map(this.renderDifficultyBlock)}
      </Container>
    );
  }

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

const DifficultyText = glamorous.text({
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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(SettingsScreen);
