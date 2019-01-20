import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import { LessonScreenParams } from "@src/content/types";
import { COLORS } from "@src/styles/Colors";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<LessonScreenParams>;
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
          {isSummaryReview ? "Content" : "Lesson"} Summary
        </Text>
        <Text style={{ marginBottom: 12 }}>
          {isSummaryReview
            ? `This is a summary of all unlocked content`
            : `${lesson.length} total words to practice in this lesson`}
        </Text>
        <Text style={SectionTextStyles}>Study</Text>
        <LineBreak />
        <ActionBlock
          style={{ backgroundColor: COLORS.actionButtonMint }}
          onPress={this.handleNavigateToSection(ROUTE_NAMES.FLASHCARDS)}
        >
          <Text>Review Flashcards</Text>
        </ActionBlock>
        <ActionBlock
          style={{ backgroundColor: COLORS.actionButtonMint }}
          onPress={this.handleNavigateToSection(ROUTE_NAMES.VIEW_ALL)}
        >
          <Text>Review All Content</Text>
        </ActionBlock>
        <Text style={SectionTextStyles}>Practice</Text>
        <LineBreak />
        <ActionBlock onPress={this.handleNavigateToSection(ROUTE_NAMES.QUIZ)}>
          <Text>Quiz</Text>
        </ActionBlock>
        <ActionBlock
          onPress={this.handleNavigateToSection(ROUTE_NAMES.MULTIPLE_CHOICE)}
        >
          <Text>Multiple Choice</Text>
        </ActionBlock>
      </Container>
    );
  }

  handleNavigateToSection = (routeName: ROUTE_NAMES) => () => {
    const lesson = this.props.navigation.getParam("lesson");
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const params: LessonScreenParams = {
      lesson,
      lessonIndex,
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

const SectionTextStyles = {
  fontSize: 14,
  marginTop: 16,
  width: "88%",
  textAlign: "left",
};

const ActionBlock = glamorous.touchableOpacity({
  width: "90%",
  margin: 6,
  padding: 12,
  backgroundColor: COLORS.primaryBlue,
});

const LineBreak = glamorous.view({
  width: "85%",
  height: StyleSheet.hairlineWidth,
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default LessonSummaryScreen;
