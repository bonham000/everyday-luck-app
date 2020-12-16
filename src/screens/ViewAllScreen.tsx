import styled from "@emotion/native";
import React from "react";
import { FlatList, Keyboard } from "react-native";
import { Searchbar } from "react-native-paper";
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
import { LessonScreenParams, Word } from "@src/tools/types";
import { filterBySearchTerm, mapWordsForList } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
}

interface IState {
  searchValue: string;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class ViewAllScreenComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      searchValue: "",
    };
  }

  render(): JSX.Element {
    const SearchBarInput = (
      <StyledSearchBar
        autoFocus
        style={SearchBarStyles}
        placeholder="Filter list (enter Chinese or English)"
        value={this.state.searchValue}
        onChangeText={this.handleSearch}
      />
    );

    return (
      <BasicContainer>
        {SearchBarInput}
        <FlatList
          onScroll={Keyboard.dismiss}
          contentContainerStyle={{ width: "100%" }}
          data={this.getListContent()}
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
        <WordText style={{ fontSize: 20 }}>"{item.english}"</WordText>
        <WordText style={{ fontSize: 20 }}>
          {item.pinyin} <SmallText>(pinyin)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 40 }}>
          {item.simplified} <SmallText>(simplified)</SmallText>
        </WordText>
        <WordText style={{ fontSize: 40 }}>
          {item.traditional} <SmallText>(traditional)</SmallText>
        </WordText>
      </WordBox>
    );
  };

  handleSearch = (searchValue: string) => {
    this.setState({ searchValue });
  };

  getListContent = () => {
    const lesson = this.props.navigation.getParam("lesson");
    const filterWords = filterBySearchTerm(this.state.searchValue);
    return lesson.filter(filterWords).map(mapWordsForList);
  };

  handlePressItem = (mandarin: string, traditional: string) => () => {
    this.props.copyToClipboard(mandarin);
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
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.white : COLORS.wordCardBorder};

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

const SearchBarStyles = {
  borderTopWidth: 1,
  borderTopColor: COLORS.lightDark,
};

const StyledSearchBar = styled(Searchbar)<any>`
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark"
      ? COLORS.textInputDarkTheme
      : COLORS.textInputLightTheme};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(ViewAllScreenComponent),
);
