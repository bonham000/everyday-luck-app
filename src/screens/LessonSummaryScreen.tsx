import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { Word } from "@src/content/mandarin/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

export interface LessonSummaryScreenParams {
  lesson: ReadonlyArray<Word>;
  lessonIndex: number;
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
    return (
      <Container>
        <Text style={TextStyles}>Lesson Summary</Text>
        <Text>{JSON.stringify(lesson)}</Text>
      </Container>
    );
  }
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 75,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const TextStyles = {
  fontSize: 16,
  width: "88%",
  fontWeight: "bold",
  textAlign: "center",
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default LessonSummaryScreen;
