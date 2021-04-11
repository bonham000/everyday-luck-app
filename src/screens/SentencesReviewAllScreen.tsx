import styled from "@emotion/native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { BasicContainer, StyledText } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingContext,
} from "@src/providers/SoundRecordingProvider";
import { SentenceScreenParams, Word } from "@src/tools/types";
import { FlatList, Keyboard } from "react-native";

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

export class SentencesReviewAllScreenComponent extends React.Component<
  IProps,
  {}
> {
  render(): JSX.Element {
    const sentences = this.props.navigation.getParam("sentences");
    return (
      <BasicContainer>
        <FlatList
          onScroll={Keyboard.dismiss}
          contentContainerStyle={{ width: "100%" }}
          data={sentences}
          renderItem={this.renderItem}
          keyExtractor={(item: Word, index: number) =>
            `${item.traditional}-${index}`
          }
        />
      </BasicContainer>
    );
  }

  renderItem = ({ item }: { item: Word; index: number }): any => {
    const content = item[this.props.languageSetting];
    return (
      <WordBox onPress={this.handlePressItem(content, item.traditional)}>
        <WordText style={{ fontSize: 40 }}>
          {item.traditional} <SmallText>(traditional)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 40 }}>
          {item.simplified} <SmallText>(simplified)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 20 }}>
          {item.pinyin} <SmallText>(pinyin)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 20 }}>"{item.english}"</WordText>
      </WordBox>
    );
  };

  handlePressItem = (mandarin: string, traditional: string) => () => {
    this.props.copyToClipboard(mandarin, false);
    this.props.handlePronounceWord(traditional);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const WordBox = styled.TouchableOpacity<any>`
  padding: 8px;
  width: 100%;
  padding-left: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.inactive : COLORS.wordCardBorder};

  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const WordText = styled(StyledText)({
  padding: 4,
  paddingLeft: 8,
});

const SmallText = styled(StyledText)({
  fontSize: 14,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(SentencesReviewAllScreenComponent),
);
