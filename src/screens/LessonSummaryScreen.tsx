import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import GlobalStateProvider, {
  GlobalStateProps,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/Routes";
import { LessonScreenParams } from "@src/content/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class LessonSummaryScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const type = this.props.navigation.getParam("type");
    const lesson = this.props.navigation.getParam("lesson");
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const isLesson = type === "LESSON";
    const { mc, q } = this.props.userScoreStatus[lessonIndex];
    return (
      <Container>
        <Text style={TextStyles}>
          {type === "LESSON"
            ? "Lesson Summary"
            : type === "SUMMARY"
            ? "Content Summary"
            : "Fun Challenge, 遊戲！"}
        </Text>
        <Text style={{ marginBottom: 12 }}>
          {type === "LESSON"
            ? `${lesson.length} total words to practice in this lesson`
            : type === "SUMMARY"
            ? "This is a summary of all unlocked content"
            : "There are 25 random words selected for you!"}
        </Text>
        {type !== "GAME" && <Text style={SectionTextStyles}>Practice</Text>}
        <LineBreak />
        <ActionBlock onPress={this.handleNavigateToSection(ROUTE_NAMES.QUIZ)}>
          <Text>Quiz</Text>
          {q && isLesson && <Text>💯</Text>}
        </ActionBlock>
        <ActionBlock
          onPress={this.handleNavigateToSection(ROUTE_NAMES.MULTIPLE_CHOICE)}
        >
          <Text>Multiple Choice</Text>
          {mc && isLesson && <Text>💯</Text>}
        </ActionBlock>
        {type !== "GAME" && (
          <React.Fragment>
            <Text style={SectionTextStyles}>Study</Text>
            <LineBreak />
            <ActionBlock
              style={{ backgroundColor: COLORS.actionButtonMint }}
              onPress={this.handleNavigateToSection(ROUTE_NAMES.FLASHCARDS)}
            >
              <Text>Flashcards</Text>
            </ActionBlock>
            <ActionBlock
              style={{ backgroundColor: COLORS.actionButtonMint }}
              onPress={this.handleNavigateToSection(ROUTE_NAMES.VIEW_ALL)}
            >
              <Text>Review All Content</Text>
            </ActionBlock>
          </React.Fragment>
        )}
      </Container>
    );
  }

  handleNavigateToSection = (routeName: ROUTE_NAMES) => () => {
    const type = this.props.navigation.getParam("type");
    const lesson = this.props.navigation.getParam("lesson");
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const params: LessonScreenParams = {
      type,
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
  height: 50,
  margin: 6,
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.lessonBlock,
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

export default (props: any) => (
  <GlobalStateProvider {...props} Component={LessonSummaryScreen} />
);
