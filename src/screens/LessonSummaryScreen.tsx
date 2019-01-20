import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import { Lesson, PracticeScreenParams } from "@src/content/types";
import { COLORS } from "@src/styles/Colors";

/** ========================================================================
 * Types
 * =========================================================================
 */

export interface LessonSummaryScreenParams {
  lesson: Lesson;
  lessonIndex: number;
  isSummaryReview: boolean;
}

interface IProps {
  navigation: NavigationScreenProp<LessonSummaryScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class LessonSummaryScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const lesson = this.props.navigation.getParam("lesson");
    const isSummaryReview = this.props.navigation.getParam("isSummaryReview");
    return (
      <Container>
        <Text style={TextStyles}>
          {isSummaryReview ? "Lesson" : "Content"} Summary
        </Text>
        <Text style={{ marginBottom: 12 }}>
          {lesson.length} total words to practice in this lesson
        </Text>
        <ActionBlock onPress={this.handleNavigateToSection(ROUTE_NAMES.QUIZ)}>
          <Text>Quiz</Text>
        </ActionBlock>
        <ActionBlock
          onPress={this.handleNavigateToSection(ROUTE_NAMES.FLASHCARDS)}
        >
          <Text>Multiple Choice</Text>
        </ActionBlock>
        <ActionBlock
          onPress={this.handleNavigateToSection(ROUTE_NAMES.FLASHCARDS)}
        >
          <Text>Flashcards</Text>
        </ActionBlock>
        <ActionBlock
          onPress={this.handleNavigateToSection(ROUTE_NAMES.VIEW_ALL)}
        >
          <Text>Review All Content</Text>
        </ActionBlock>
      </Container>
    );
  }

  handleNavigateToSection = (routeName: ROUTE_NAMES) => () => {
    const lesson = this.props.navigation.getParam("lesson");
    const params: PracticeScreenParams = {
      lesson,
    };
    this.props.navigation.navigate(routeName, params);
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

const TextStyles = {
  fontSize: 16,
  width: "88%",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 16,
};

const ActionBlock = glamorous.touchableOpacity({
  width: "90%",
  margin: 6,
  padding: 12,
  backgroundColor: COLORS.primaryBlue,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default LessonSummaryScreen;
