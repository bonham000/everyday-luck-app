import glamorous from "glamorous-native";
import React from "react";
import { ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import GlobalStateProvider, {
  GlobalStateProps,
} from "@src/components/GlobalStateProvider";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/Routes";
import {
  LessonScreenParams,
  LessonSummaryType,
  Word,
} from "@src/content/types";
import { getFinalUnlockedLesson, knuthShuffle } from "@src/tools/utils";

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

class HomeScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { lessons, userScoreStatus } = this.props;
    const unlockedLessonIndex = getFinalUnlockedLesson(userScoreStatus);
    return (
      <Container>
        <Text style={TextStyles}>Choose a lesson to start studying</Text>
        {lessons.map((lesson, index) => {
          const isLocked = index > unlockedLessonIndex;
          const isFinalUnlocked = index === unlockedLessonIndex;
          return (
            <LessonLink
              style={{
                backgroundColor: isLocked
                  ? COLORS.lockedLessonBlock
                  : COLORS.lessonBlock,
              }}
              onPress={() => {
                if (isLocked) {
                  this.props.setToastMessage(
                    "Please complete the previous lesson first",
                  );
                } else {
                  this.openLessonSummary(lesson, index)();
                }
              }}
            >
              <Text
                style={
                  isLocked
                    ? {
                        color: COLORS.inactive,
                        fontWeight: "normal",
                        textDecorationLine: "line-through",
                        textDecorationStyle: "solid",
                      }
                    : {
                        color: "black",
                        fontWeight: "500",
                        textDecorationLine: "normal",
                      }
                }
              >
                Lesson {index + 1}
              </Text>
              {isFinalUnlocked && <Text>🤹‍♂️</Text>}
              {isLocked && <Text>🔐</Text>}
            </LessonLink>
          );
        })}
        <LineBreak />
        <ReviewLink
          onPress={this.openLessonSummary(
            knuthShuffle(
              lessons
                .slice(0, unlockedLessonIndex + 1)
                .reduce((flattened, lesson) => [...flattened, ...lesson]),
            ).slice(0, 25),
            0,
            "GAME",
          )}
        >
          <Text style={{ fontWeight: "600" }}>Game Mode!</Text>
          <Text>🎲</Text>
        </ReviewLink>
        <ReviewLink
          onPress={this.openLessonSummary(
            lessons
              .slice(0, unlockedLessonIndex + 1)
              .reduce((flattened, lesson) => [...flattened, ...lesson]),
            0,
            "SUMMARY",
          )}
        >
          <Text style={{ fontWeight: "600" }}>View All Unlocked Content</Text>
          <Text>📚</Text>
        </ReviewLink>
      </Container>
    );
  }

  openLessonSummary = (
    lesson: ReadonlyArray<Word>,
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

const LessonLink = glamorous.touchableOpacity({
  width: "90%",
  height: 50,
  padding: 12,
  margin: 4,
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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default (props: any) => (
  <GlobalStateProvider {...props} Component={HomeScreen} />
);
