import glamorous from "glamorous-native";
import React from "react";
import { ScrollView, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import {
  GlobalStateProps,
  withGlobalState,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import {
  Lesson,
  LessonScreenParams,
  LessonSummaryType,
} from "@src/tools/types";
import { getFinalUnlockedList } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class ListSummaryScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Container>
        <Text style={TextStyles}>Choose a lesson to start studying</Text>
        {this.renderLessons()}
      </Container>
    );
  }

  renderLessons = () => {
    const { lessons, userScoreStatus } = this.props;
    const unlockedLessonIndex = getFinalUnlockedList(userScoreStatus);
    return lessons.map((lesson, index) => {
      const isLocked = index > unlockedLessonIndex;
      const { list, content } = lesson;
      return (
        <LessonBlock
          style={{
            backgroundColor: isLocked
              ? COLORS.lockedLessonBlock
              : COLORS.lessonBlock,
          }}
          onPress={this.handleSelectLesson(content, index, isLocked)}
        >
          <LessonBlockText isLocked={isLocked}>
            HSL List ${list}
          </LessonBlockText>
        </LessonBlock>
      );
    });
  };

  handleSelectLesson = (
    lesson: Lesson,
    index: number,
    isLocked: boolean,
  ) => () => {
    if (isLocked) {
      this.props.setToastMessage("Please complete the previous lesson first");
    } else {
      this.openLessonSummary(lesson, index)();
    }
  };

  openLessonSummary = (
    lesson: Lesson,
    index: number,
    type: LessonSummaryType = "LESSON",
  ) => () => {
    const params: LessonScreenParams = {
      type,
      lesson,
      lessonIndex: index,
    };
    this.props.navigation.navigate(ROUTE_NAMES.LESSON_SUMMARY, params);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = (props: { children: any }) => (
  <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      width: "100%",
      paddingTop: 25,
      paddingBottom: 150,
      alignItems: "center",
    }}
  >
    {props.children}
  </ScrollView>
);

const LessonBlock = glamorous.touchableOpacity({
  width: "90%",
  height: 50,
  padding: 12,
  margin: 4,
  borderRadius: 5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgb(225,225,225)",
});

const ReviewLink = glamorous.touchableOpacity({
  width: "90%",
  height: 50,
  padding: 12,
  margin: 4,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.actionButtonMint,
});

const TextStyles = {
  fontSize: 16,
  width: "88%",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 16,
};

const LineBreak = glamorous.view({
  width: "85%",
  height: 1,
  marginTop: 16,
  marginBottom: 16,
  backgroundColor: COLORS.line,
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
