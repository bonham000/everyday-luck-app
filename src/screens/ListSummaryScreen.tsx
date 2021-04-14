import styled from "@emotion/native";
import React from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { LessonBlock, LessonBlockText } from "@src/components/SharedComponents";
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
  knuthShuffle,
  mapListIndexToListScores,
} from "@src/tools/utils";

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
    const listTitle = this.props.navigation.getParam("listTitle");
    const dictation = this.props.navigation.getParam("dictation");
    const hskList = this.props.navigation.getParam("hskList");
    const listId = this.props.navigation.getParam("id");
    const listScore = mapListIndexToListScores(listId, userScoreStatus);
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
    const listId = this.props.navigation.getParam("id");
    const listScore = mapListIndexToListScores(listId, userScoreStatus);
    const unlockedLessonIndex = determineFinalUnlockedLessonInList(
      lesson,
      listId,
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
    const id = this.props.navigation.getParam("id");
    const contentType = this.props.navigation.getParam("contentType");
    const listIndex = this.props.navigation.getParam("listIndex");
    const listTitle = this.props.navigation.getParam("listTitle");
    const listKey = this.props.navigation.getParam("listKey");
    const dictation = this.props.navigation.getParam("dictation");
    const params: LessonScreenParams = {
      id,
      type,
      lesson,
      listKey,
      listIndex,
      listTitle,
      dictation,
      contentType,
      lessonIndex,
      isFinalLesson,
      isFinalUnlockedLesson,
    };
    this.props.navigation.navigate(ROUTE_NAMES.LESSON_SUMMARY, params);
  };

  handleTestOut = () => {
    const { lessons, userScoreStatus } = this.props;
    const listIndex = this.props.navigation.getParam("listIndex");
    const id = this.props.navigation.getParam("id");
    const args: DeriveLessonContentArgs = {
      listId: id,
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
    const id = this.props.navigation.getParam("id");
    const contentType = this.props.navigation.getParam("contentType");
    const type = this.props.navigation.getParam("type");
    const dictation = this.props.navigation.getParam("dictation");
    const listIndex = this.props.navigation.getParam("listIndex");
    const listKey = this.props.navigation.getParam("listKey");

    if (dictation) {
      const params: LessonScreenParams = {
        id,
        type,
        listKey,
        listIndex,
        contentType,
        lesson: dictation,
        lessonIndex: NaN, // Fuck!
        isFinalLesson: false,
        isFinalUnlockedLesson: false,
      };

      this.props.navigation.navigate(routeName, params);
    }
  };

  handleStudyAll = () => {
    // const { lessons, userScoreStatus } = this.props;
    const lesson = this.props.navigation.getParam("hskList");
    const shuffledList = knuthShuffle(
      lesson.reduce((flat, c) => flat.concat(c), []),
    );
    // const id = this.props.navigation.getParam("id");
    const listIndex = this.props.navigation.getParam("listIndex");
    // const args: DeriveLessonContentArgs = {
    //   listId: id,
    //   lists: lesson,
    //   unlockedListIndex: listIndex,
    //   appDifficultySetting: OPT_OUT_LEVEL /* TODO: Change? */,
    //   userScoreStatus,
    //   limitToCurrentList: true,
    // };
    // const randomQuizSet = getRandomQuizChallenge(args);
    // this.openLessonSummarySpecial(randomQuizSet, "SUMMARY", listIndex)();
    this.openLessonSummarySpecial(shuffledList, "SUMMARY", listIndex)();
  };

  openLessonSummarySpecial = (
    lesson: Lesson,
    type: LessonSummaryType,
    listIndex: number,
  ) => () => {
    const id = this.props.navigation.getParam("id");
    const listKey = this.props.navigation.getParam("listKey");
    const listTitle = this.props.navigation.getParam("listTitle");
    const contentType = this.props.navigation.getParam("contentType");

    const params: LessonScreenParams = {
      id,
      type,
      lesson,
      listKey,
      listIndex,
      listTitle,
      contentType,
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
  width: 100%;
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
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const SubText = styled.Text<any>`
  font-size: 13px;
  width: 100%;
  margin-bottom: 6px;
  text-align: center;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
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
