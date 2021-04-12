import styled from "@emotion/native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { ScrollContainer } from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingContext,
} from "@src/providers/SoundRecordingProvider";
import { GrammarScreenParams } from "@src/tools/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<{}, GrammarScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class GrammarSummaryScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { navigation } = this.props;
    const listTitle = navigation.getParam("listTitle");
    const { length } = navigation.getParam("content");

    return (
      <ScrollContainer>
        <TitleText>{listTitle}</TitleText>
        <SubText>
          This section includes sentences for grammar review practice.
        </SubText>
        <SubText>There are a total of {length} examples.</SubText>
        <ActionBlock
          onPress={this.navigateToPracticeQuiz}
          style={{ backgroundColor: COLORS.actionButtonMint }}
        >
          <Text>Practice Quiz</Text>
          <Text>🗂</Text>
        </ActionBlock>
        <ActionBlock
          style={{ backgroundColor: COLORS.actionButtonMint }}
          onPress={this.navigateToReviewAllScreen}
        >
          <Text>Review All Content</Text>
          <Text>🗃</Text>
        </ActionBlock>
      </ScrollContainer>
    );
  }

  getNextScreenParams = (): any => {
    const id = this.props.navigation.getParam("id");
    const listKey = this.props.navigation.getParam("listKey");
    const sentences = this.props.navigation.getParam("content");
    const contentType = this.props.navigation.getParam("contentType");
    const listTitle = this.props.navigation.getParam("listTitle");
    const sentenceParams: GrammarScreenParams = {
      id,
      listKey,
      content: sentences,
      contentType,
      listTitle,
    };
    return sentenceParams;
  };

  navigateToPracticeQuiz = () => {
    const params = this.getNextScreenParams();
    this.props.navigation.navigate(ROUTE_NAMES.GRAMMAR_QUIZ, params);
  };

  navigateToReviewAllScreen = () => {
    const params = this.getNextScreenParams();
    this.props.navigation.navigate(ROUTE_NAMES.GRAMMAR_REVIEW_ALL, params);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TitleText = styled.Text<any>`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const SubText = styled.Text<any>`
  font-size: 16px;
  width: 85%;
  text-align: center;
  margin-bottom: 16px;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const ActionBlock = styled.TouchableOpacity({
  width: "90%",
  height: 50,
  margin: 6,
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.lessonBlock,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(GrammarSummaryScreenComponent),
);
