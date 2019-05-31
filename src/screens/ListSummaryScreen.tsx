import glamorous from "glamorous-native";
import React from "react";
import { FlatList, TextStyle } from "react-native";
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
    /**
     * TODO: Convert hskList to be separated with review lessons
     * every 5 lessons.
     */
    const hskList = this.props.navigation.getParam("hskList");
    const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
    return (
      <Container>
        <TitleText>Choose a lesson to start studying</TitleText>
        <FlatList
          data={hskList}
          renderItem={this.renderItem}
          contentContainerStyle={FlatListStyles}
          /* Pass extraData to force re-render when a new lesson is completed */
          extraData={listScore.number_words_completed}
          keyExtractor={item => `${item[0].traditional}-${item[0].pinyin}`}
        />
        {!listScore.complete && (
          <OptOutBlock>
            <SubText>
              Already mastered this HSK Level? Prove your knowledge to opt-out
              and unlock the next level immediately.
            </SubText>
            <LessonBlock
              onPress={this.handleTestOut}
              style={{
                backgroundColor: COLORS.actionButtonYellow,
              }}
            >
              <LessonBlockText isLocked={false}>
                Test out of this HSK Level
              </LessonBlockText>
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
        style={{
          backgroundColor: shouldShowTrophy
            ? COLORS.lessonBlock
            : inProgress
            ? COLORS.lessonBlockInProgress
            : COLORS.lockedLessonBlock,
        }}
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
    const params: LessonScreenParams = {
      type,
      lesson,
      listIndex,
      isFinalLesson,
      lessonIndex,
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

  openLessonSummarySpecial = (
    lesson: Lesson,
    type: LessonSummaryType,
    listIndex: number,
  ) => () => {
    const params: LessonScreenParams = {
      type,
      lesson,
      listIndex,
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

const Container = glamorous.view({
  flex: 1,
  width: "100%",
  backgroundColor: COLORS.background,
});

const FlatListStyles = {
  paddingBottom: 30,
  paddingLeft: 15,
  paddingRight: 15,
};

const LessonBlock = glamorous.touchableOpacity({
  height: 50,
  padding: 12,
  margin: 4,
  borderRadius: 5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.lessonBlockDefault,
});

const TitleText = glamorous.text({
  fontSize: 16,
  width: "100%",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 15,
  marginBottom: 15,
});

const SubText = glamorous.text({
  fontSize: 13,
  width: "100%",
  marginBottom: 6,
  textAlign: "center",
});

const OptOutBlock = glamorous.view({
  paddingTop: 15,
  paddingBottom: 25,
  paddingLeft: 15,
  paddingRight: 15,
  borderTopWidth: 1,
  borderTopColor: COLORS.fadedText,
});

const LessonBlockText = glamorous.text(
  {},
  (props: { isLocked: boolean }) =>
    (props.isLocked
      ? {
          color: COLORS.inactive,
          fontWeight: "500",
          textDecorationStyle: "solid",
        }
      : {
          color: "black",
          fontWeight: "500",
          textDecorationLine: "none",
        }) as TextStyle,
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(ListSummaryScreenComponent);
