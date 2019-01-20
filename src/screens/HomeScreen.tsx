import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import LanguagesSelectionProvider from "@src/components/LanguageSelectionProvider";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/Routes";
import { getLanguageContent, getLessonSet } from "@src/content";
import { LessonScreenParams, Word } from "@src/content/types";
import { LanguageSelection } from "@src/GlobalContext";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
  selectedLanguage: LanguageSelection;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class HomeScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { selectedLanguage } = this.props;
    const LESSONS = getLessonSet(selectedLanguage);
    const ALL_LESSONS = getLanguageContent(selectedLanguage);
    return (
      <Container>
        <Text style={TextStyles}>Choose a lesson to start studying</Text>
        {LESSONS.map((lesson, index) => {
          return (
            <LessonLink onPress={this.openLessonSummary(lesson, index)}>
              <Text>Lesson {index + 1}</Text>
              <Text>🔐</Text>
            </LessonLink>
          );
        })}
        <LineBreak />
        <ReviewLink onPress={this.openLessonSummary(ALL_LESSONS, 0, true)}>
          <Text>View all unlocked lessons</Text>
        </ReviewLink>
      </Container>
    );
  }

  openLessonSummary = (
    lesson: ReadonlyArray<Word>,
    index: number,
    isSummaryReview: boolean = false,
  ) => () => {
    const params: LessonScreenParams = {
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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
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

const LineBreak = glamorous.view({
  width: "85%",
  height: 1,
  marginTop: 16,
  marginBottom: 16,
  backgroundColor: COLORS.line,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default (props: any) => (
  <LanguagesSelectionProvider {...props} Component={HomeScreen} />
);
