import glamorous from "glamorous-native";
import React from "react";
import { Button, Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";
import { APP_DIFFICULTY_SETTING } from "@src/GlobalState";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}>;
}

interface IState {
  loading: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class SettingsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render(): JSX.Element {
    return (
      <Container>
        <Button
          dark
          mode="contained"
          style={{
            marginTop: 30,
            minWidth: 215,
            backgroundColor: COLORS.primaryBlue,
          }}
          onPress={this.handleSetLanguageOptions}
        >
          Switch Language
        </Button>
        <Text>Set app difficulty:</Text>
        <DifficultSettingBlock
          selected={
            this.props.appDifficultySetting === APP_DIFFICULTY_SETTING.EASY
          }
          onPress={this.setAppDifficulty(APP_DIFFICULTY_SETTING.EASY)}
        >
          <Text>Easy (10 questions per quiz)</Text>
        </DifficultSettingBlock>
        <DifficultSettingBlock
          selected={
            this.props.appDifficultySetting === APP_DIFFICULTY_SETTING.MEDIUM
          }
          onPress={this.setAppDifficulty(APP_DIFFICULTY_SETTING.MEDIUM)}
        >
          <Text>Medium (25 questions per quiz)</Text>
        </DifficultSettingBlock>
        <DifficultSettingBlock
          selected={
            this.props.appDifficultySetting === APP_DIFFICULTY_SETTING.HARD
          }
          onPress={this.setAppDifficulty(APP_DIFFICULTY_SETTING.HARD)}
        >
          <Text>Hard (50 questions per quiz)</Text>
        </DifficultSettingBlock>
      </Container>
    );
  }

  setAppDifficulty = (setting: APP_DIFFICULTY_SETTING) => () => {
    this.props.handleUpdateAppDifficultySetting(setting);
  };

  handleSetLanguageOptions = () => {
    this.props.handleSwitchLanguage(this.props.navigation.closeDrawer);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 75,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const DifficultSettingBlock = glamorous.touchableOpacity(
  {
    marginTop: 10,
    width: "85%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  ({ selected }: { selected: boolean }) => ({
    backgroundColor: selected ? COLORS.actionButtonYellow : COLORS.lightDark,
  }),
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(SettingsScreen);
