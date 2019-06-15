import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  Button,
  ScrollContainer,
} from "@src/components/SharedComponents";
import EVENTS from "@src/constants/AnalyticsEvents";
import { COLORS } from "@src/constants/Theme";
import { APP_DIFFICULTY_SETTING } from "@src/providers/GlobalStateContext";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  capitalize,
  convertAppDifficultyToLessonSize,
  formatUserLanguageSetting,
  getAlternateLanguageSetting,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class SettingsScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { languageSetting, disableAudio } = this.props;
    return (
      <ScrollContainer>
        <SectionTitle>Language Setting</SectionTitle>
        <Text>
          Your current language setting is:{" "}
          <Bold>{formatUserLanguageSetting(languageSetting)}</Bold>
        </Text>
        <Button
          onPress={this.handleSetLanguageOptions}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Switch to {getAlternateLanguageSetting(languageSetting)} Chinese
        </Button>
        <LineBreak />
        <SectionTitle>Pronunciation Settings</SectionTitle>
        <Text>
          Audio word pronunciation is currently:{" "}
          <Bold>{disableAudio ? "Disabled" : "Enabled"}</Bold>
        </Text>
        <Button
          onPress={this.handleSetAudioOptions}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          {disableAudio ? "Enable" : "Disable"} Pronunciation
        </Button>
        <LineBreak />
        <SectionTitle>Quiz Difficulty Setting</SectionTitle>
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
        <SectionTitle>Experience Points</SectionTitle>
        <InfoText>
          You currently have{" "}
          <Bold>{this.props.experience.toLocaleString()}</Bold> experience
          points.
        </InfoText>
        <InfoText>
          You can use these experience points on any quiz challenge to reclaim a
          question if you answer it incorrectly. You will still be prompted to
          answer the same question again later in the quiz, but this can help
          you to recover from missed words.
        </InfoText>
      </ScrollContainer>
    );
  }

  renderDifficultyBlock = (setting: APP_DIFFICULTY_SETTING) => {
    const selected = setting === this.props.appDifficultySetting;
    return (
      <DifficultSettingBlock
        key={setting}
        selected={selected}
        onPress={this.setAppDifficulty(setting)}
      >
        <DifficultSettingBlockText selected={selected}>
          {capitalize(setting)} ({convertAppDifficultyToLessonSize(setting)}{" "}
          questions per quiz)
        </DifficultSettingBlockText>
        {selected && <Text>✅</Text>}
      </DifficultSettingBlock>
    );
  };

  setAppDifficulty = (setting: APP_DIFFICULTY_SETTING) => () => {
    this.props.handleUpdateUserSettingsField({
      app_difficulty_setting: setting,
    });
  };

  handleSetLanguageOptions = () => {
    this.props.handleSwitchLanguage();
  };

  handleSetAudioOptions = () => {
    this.props.handleUpdateUserSettingsField({
      disable_audio: !this.props.disableAudio,
    });
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

export default withGlobalStateContext(SettingsScreenComponent);
