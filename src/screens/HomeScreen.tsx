import { ROUTE_NAMES } from "@src/constants/Routes";
import ALL_LESSONS, { LESSONS } from "@src/content/mandarin";
import { Word } from "@src/content/mandarin/types";
import { COLORS } from "@src/styles/Colors";
import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";
import { LessonSummaryScreenParams } from "./LessonSummaryScreen";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class HomeScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Container>
        <Text style={TextStyles}>Choose a lesson to start studying</Text>
        {LESSONS.map((lesson, index) => {
          return (
            <LessonLink onPress={this.openLessonSummary(lesson, index)}>
              <Text>Lesson {index + 1}</Text>
            </LessonLink>
          );
        })}
        <ReviewLink onPress={this.openLessonSummary(ALL_LESSONS, 0, true)}>
          <Text>Review all content</Text>
        </ReviewLink>
      </Container>
    );
  }

  openLessonSummary = (
    lesson: ReadonlyArray<Word>,
    index: number,
    isSummaryReview: boolean = false,
  ) => () => {
    const params: LessonSummaryScreenParams = {
      lesson,
      lessonIndex: index,
      isSummaryReview,
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
  paddingTop: 35,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const LessonLink = glamorous.touchableOpacity({
  width: "90%",
  padding: 10,
  margin: 4,
  backgroundColor: "rgb(225,225,225)",
});

const ReviewLink = glamorous.touchableOpacity({
  width: "90%",
  padding: 10,
  margin: 4,
  backgroundColor: COLORS.actionButtonMint,
});

const TextStyles = {
  fontSize: 16,
  width: "88%",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 16,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default HomeScreen;
