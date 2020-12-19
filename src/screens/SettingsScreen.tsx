import styled from "@emotion/native";
import React from "react";
import { Switch, Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import {
  Bold,
  Button,
  ScrollContainer,
} from "@src/components/SharedComponents";
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
    const {
      languageSetting,
      disableAudio,
      appTheme,
      toggleAppTheme,
    } = this.props;
    return (
      <ScrollContainer>
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
        <LineBreak />
        <SectionTitle>Language Setting</SectionTitle>
        <BasicText>
          Your current language setting is:{" "}
          <Bold>{formatUserLanguageSetting(languageSetting)}</Bold>
        </BasicText>
        <InfoText style={{ marginTop: 12 }}>
          Simplified Chinese is the most common version of the written language.
          However, Traditional Chinese is still used in places like Taiwan, and
          Hong Kong.
        </InfoText>
        <Button
          onPress={this.handleSetLanguageOptions}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Switch to {getAlternateLanguageSetting(languageSetting)} Chinese
        </Button>
        <LineBreak />
        <SectionTitle>Pronunciation Settings</SectionTitle>
        <BasicText>
          Audio word pronunciation is currently:{" "}
          <Bold>{disableAudio ? "Disabled" : "Enabled"}</Bold>
        </BasicText>
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
        <SectionTitle>App Theme</SectionTitle>
        <BasicText>Toggle app dark theme on and off.</BasicText>
        <Switch
          value={appTheme === "dark"}
          color={COLORS.primaryBlue}
          onValueChange={toggleAppTheme}
          style={{ marginTop: 15, marginBottom: 15 }}
        />
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

const BasicText = styled(Text)<any>`
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const SectionTitle = styled.Text<any>`
  font-size: 22px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const InfoText = styled.Text<any>`
  margin-top: 5px;
  margin-bottom: 5px;
  width: 80%;
  text-align: center;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const LineBreak = styled.View<any>`
  width: 85%;
  margin-top: 12px;
  margin-bottom: 12px;
  height: 1px;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.dark};
`;

const DifficultSettingBlock = styled.TouchableOpacity<any>`
  margin-top: 10px;
  width: 85%;
  height: 50px;
  padding-left: 8px;
  padding-right: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: ${props => (props.selected ? 500 : 200)};

  background-color: ${(
    props: NativeStyleThemeProps & { selected: boolean },
  ) => {
    if (props.selected) {
      return COLORS.primaryBlue;
    }

    if (props.theme.type === "dark") {
      return COLORS.choiceBlockDarkTheme;
    } else {
      return COLORS.lessonBlockLightInactive;
    }
  }};
`;

const DifficultSettingBlockText = styled.Text<any>`
  font-weight: ${props => (props.selected ? "bold" : "normal")};

  color: ${(props: NativeStyleThemeProps & { selected: boolean }) => {
    if (props.selected) {
      return COLORS.white;
    }

    if (props.theme.type === "dark") {
      return COLORS.textDarkTheme;
    } else {
      return COLORS.fadedText;
    }
  }};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(SettingsScreenComponent);
