import styled from "@emotion/native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { Container } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingContext,
} from "@src/providers/SoundRecordingProvider";
import { SentenceScreenParams } from "@src/tools/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<{}, SentenceScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class SentencesPracticeQuizScreenComponent extends React.Component<
  IProps,
  {}
> {
  render(): JSX.Element {
    return (
      <Container>
        <TitleText>Sentences Practice Quiz</TitleText>
      </Container>
    );
  }
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

const SectionTitleText = styled.Text<any>`
  width: 88%;
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
  text-align: left;
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

const LineBreak = styled.View<any>`
  width: 85%;
  margin-top: 12;
  margin-bottom: 12;
  height: 1px;

  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.darkText};
`;

const InfoText = styled.Text<any>`
  width: 85%;
  text-align: center;
  margin-top: 15px;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(SentencesPracticeQuizScreenComponent),
);
