import glamorous from "glamorous-native";
import React from "react";
import { FlatList, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import {
  GlobalStateProps,
  withGlobalState,
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

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}, ListScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class ListSummaryScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const hskList = this.props.navigation.getParam("hskList");
    return (
      <Container>
        <TitleText>Choose a lesson to start studying</TitleText>
        <FlatList
          data={hskList}
          renderItem={this.renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={item => `${item[0].traditional}-${item[0].pinyin}`}
        />
      </Container>
    );
  }

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
  paddingTop: 25,
  paddingLeft: 15,
  paddingRight: 15,
  backgroundColor: "rgb(231,237,240)",
});

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
  marginBottom: 16,
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
          textDecorationLine: "normal",
        }) as TextStyle,
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalState(ListSummaryScreen);
