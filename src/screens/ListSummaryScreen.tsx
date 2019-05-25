import glamorous from "glamorous-native";
import React from "react";
import { FlatList, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
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
  determineFinalUnlockedLesson,
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
    const hskList = this.props.navigation.getParam("hskList");
    return (
      <Container>
        <TitleText>Choose a lesson to start studying</TitleText>
        <FlatList
          data={hskList}
          renderItem={this.renderItem}
          contentContainerStyle={FlatListStyles}
          keyExtractor={item => `${item[0].traditional}-${item[0].pinyin}`}
        />
        <OptOutBlock>
          <SubText>
            Already mastered this HSK Level? Prove your knowledge to opt-out and
            unlock the next level immediately.
          </SubText>
          <LessonBlock
            onPress={this.testOut}
            style={{
              backgroundColor: COLORS.actionButtonYellow,
            }}
          >
            <LessonBlockText isLocked={false}>
              Test out of this HSK Level
            </LessonBlockText>
            <Text>🏆</Text>
          </LessonBlock>
        </OptOutBlock>
      </Container>
    );
  }

  testOut = () => {
    console.log("Impl");
  };

  renderItem = ({ item, index }: { item: Lesson; index: number }): any => {
    const lesson = item;
    const hskList = this.props.navigation.getParam("hskList");
    const listIndex = this.props.navigation.getParam("listIndex");
    const { appDifficultySetting, userScoreStatus } = this.props;
    const listScore = mapListIndexToListScores(listIndex, userScoreStatus);
    const unlockedLessonIndex = determineFinalUnlockedLesson(
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
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  width: "100%",
  backgroundColor: "rgb(231,237,240)",
});

const FlatListStyles = { paddingBottom: 50, paddingLeft: 15, paddingRight: 15 };

const LessonBlock = glamorous.touchableOpacity({
  height: 50,
  padding: 12,
  margin: 4,
  borderRadius: 5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgb(225,225,225)",
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
  borderTopColor: COLORS.darkText,
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
