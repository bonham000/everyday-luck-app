import styled from "@emotion/native";
import React from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import { OPT_OUT_LEVEL } from "@src/providers/GlobalStateContext";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  Lesson,
  LessonScreenParams,
  LessonSummaryType,
  ListScreenParams,
} from "@src/tools/types";
import {
  DeriveLessonContentArgs,
  determineFinalUnlockedLessonInList,
  getRandomQuizChallenge,
  mapListIndexToListScores,
} from "@src/tools/utils";
import { NativeStyleThemeProps } from "App";
import { LessonBlock, LessonBlockText } from "@src/components/SharedComponents";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}, ListScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class ListSummaryScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { userScoreStatus } = this.props;
    const listIndex = this.props.navigation.getParam("listIndex");
    const listTitle = this.props.navigation.getParam("listTitle");
    const dictation = this.props.navigation.getParam("dictation");
    const hskList = this.props.navigation.getParam("hskList");
    const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
    return (
      <Container>
        {dictation && dictation.length > 0 && (
          <View style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
            <LessonBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.CHARACTER_WRITING,
              )}
              style={{
                backgroundColor: COLORS.lessonCustomList,
              }}
            >
              <LessonBlockText isLocked={false}>
                Lesson Dictation
              </LessonBlockText>
              <Text>🎨</Text>
            </LessonBlock>
          </View>
        )}
        <TitleText>Choose a lesson to start studying</TitleText>
        <FlatList
          data={hskList}
          renderItem={this.renderItem}
          contentContainerStyle={FlatListStyles}
          /* Pass extraData to force re-render when a new lesson is completed */
          extraData={listScore.number_words_completed}
          keyExtractor={item => `${item[0].traditional}-${item[0].pinyin}`}
        />
        {!listScore.complete ? (
          <OptOutBlock>
            <SubText>
              {listTitle
                ? "Feel confident? Show your mastery of all of this content! You have to pass with a perfect score."
                : "Already mastered this HSK Level? Prove your knowledge to opt-out and unlock the next level immediately."}
            </SubText>
            <LessonBlock
              onPress={this.handleTestOut}
              style={{
                backgroundColor: COLORS.actionButtonYellow,
              }}
            >
              <LessonBlockText isLocked={false}>
                {listTitle
                  ? "Test out of this lesson!"
                  : "Test out of this HSK Level"}
              </LessonBlockText>
              <Text>👨‍🎓👩‍🎓</Text>
            </LessonBlock>
          </OptOutBlock>
        ) : (
          <OptOutBlock>
            <SubText>Quiz all the content in this lesson.</SubText>
            <LessonBlock
              onPress={this.handleStudyAll}
              style={{
                backgroundColor: COLORS.actionButtonYellow,
              }}
            >
              <LessonBlockText isLocked={false}>Review All</LessonBlockText>
              <Text>👨‍🎓👩‍🎓</Text>
            </LessonBlock>
          </OptOutBlock>
        )}
      </Container>
    );
  }

  renderItem = ({ item, index }: { item: Lesson; index: number }): any => {
    const lesson = item;
    const { appDifficultySetting, userScoreStatus } = this.props;
    const hskList = this.props.navigation.getParam("hskList");
    const listIndex = this.props.navigation.getParam("listIndex");
    const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
    const unlockedLessonIndex = determineFinalUnlockedLessonInList(
      lesson,
      listIndex,
      userScoreStatus,
      appDifficultySetting,
    );

    const isFinalLesson = index === hskList.length - 1;
    const shouldShowTrophy = listScore.complete || index < unlockedLessonIndex;
    const isLocked = shouldShowTrophy ? false : index > unlockedLessonIndex;
    const inProgress = !shouldShowTrophy && !isLocked;

    return (
      <LessonBlock
        hskLocked={true}
        isLocked={isLocked}
        inProgress={inProgress}
        onPress={this.handleSelectLesson(
          lesson,
          index,
          isLocked,
          isFinalLesson,
          index === unlockedLessonIndex,
        )}
      >
        <LessonBlockText isLocked={isLocked}>
          Lesson {index + 1}
        </LessonBlockText>
        {shouldShowTrophy && <Text>🏅</Text>}
        {inProgress && <Text>📝</Text>}
      </LessonBlock>
    );
  };

  handleSelectLesson = (
    lesson: Lesson,
    index: number,
    isLocked: boolean,
    isFinalLesson: boolean,
    isFinalUnlockedLesson: boolean,
  ) => () => {
    if (isLocked) {
      this.props.setToastMessage("Please complete the previous lesson first!");
    } else {
      this.openLessonSummary(
        lesson,
        index,
        isFinalLesson,
        isFinalUnlockedLesson,
      )();
    }
  };

  openLessonSummary = (
    lesson: Lesson,
    lessonIndex: number,
    isFinalLesson: boolean,
    isFinalUnlockedLesson: boolean,
    type: LessonSummaryType = "LESSON",
  ) => () => {
    const listIndex = this.props.navigation.getParam("listIndex");
    const listTitle = this.props.navigation.getParam("listTitle");
    const dictation = this.props.navigation.getParam("dictation");
    const params: LessonScreenParams = {
      type,
      lesson,
      listIndex,
      listTitle,
      dictation,
      lessonIndex,
      isFinalLesson,
      isFinalUnlockedLesson,
    };
    this.props.navigation.navigate(ROUTE_NAMES.LESSON_SUMMARY, params);
  };

  handleTestOut = () => {
    const { lessons, userScoreStatus } = this.props;
    const listIndex = this.props.navigation.getParam("listIndex");
    const args: DeriveLessonContentArgs = {
      lists: lessons,
      unlockedListIndex: listIndex,
      appDifficultySetting: OPT_OUT_LEVEL,
      userScoreStatus,
      limitToCurrentList: true,
    };
    const randomQuizSet = getRandomQuizChallenge(args);
    this.openLessonSummarySpecial(
      randomQuizSet,
      "OPT_OUT_CHALLENGE",
      listIndex,
    )();
  };

  handleNavigateToSection = (routeName: ROUTE_NAMES) => () => {
    const type = this.props.navigation.getParam("type");
    const dictation = this.props.navigation.getParam("dictation");
    const listIndex = this.props.navigation.getParam("listIndex");

    if (dictation) {
      const params: LessonScreenParams = {
        type,
        lesson: dictation,
        listIndex,
        lessonIndex: NaN, // Fuck!
        isFinalLesson: false,
        isFinalUnlockedLesson: false,
      };

      this.props.navigation.navigate(routeName, params);
    }
  };

  handleStudyAll = () => {
    const { lessons, userScoreStatus } = this.props;
    const listIndex = this.props.navigation.getParam("listIndex");
    const args: DeriveLessonContentArgs = {
      lists: lessons,

      unlockedListIndex: listIndex,
      appDifficultySetting: OPT_OUT_LEVEL /* TODO: Change? */,
      userScoreStatus,
      limitToCurrentList: true,
    };
    const randomQuizSet = getRandomQuizChallenge(args);
    this.openLessonSummarySpecial(randomQuizSet, "SUMMARY", listIndex)();
  };

  openLessonSummarySpecial = (
    lesson: Lesson,
    type: LessonSummaryType,
    listIndex: number,
  ) => () => {
    const listTitle = this.props.navigation.getParam("listTitle");
    const params: LessonScreenParams = {
      type,
      lesson,
      listIndex,
      listTitle,
      lessonIndex: Infinity,
      isFinalLesson: false,
      isFinalUnlockedLesson: false,
    };

    this.props.navigation.navigate(ROUTE_NAMES.LESSON_SUMMARY, params);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = styled.View<any>`
  flex: 1;
  width: "100%";
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const FlatListStyles = {
  paddingBottom: 30,
  paddingLeft: 15,
  paddingRight: 15,
};

const TitleText = styled.Text<any>`
  font-size: 16px;
  width: 100%;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.whiteThemeText : COLORS.darkText};
`;

const SubText = styled.Text<any>`
  font-size: 13px;
  width: 100%;
  margin-bottom: 6px;
  text-align: center;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.whiteThemeText : COLORS.darkText};
`;

const OptOutBlock = styled.View({
  paddingTop: 15,
  paddingBottom: 25,
  paddingLeft: 15,
  paddingRight: 15,
  borderTopWidth: 1,
  borderTopColor: COLORS.fadedText,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(ListSummaryScreenComponent);
