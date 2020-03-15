import glamorous from "glamorous-native";
import React from "react";
import { TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { ScrollContainer } from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  HSKList,
  LessonScreenParams,
  LessonSummaryType,
  ListScreenParams,
} from "@src/tools/types";
import {
  adjustListContentByDifficultySetting,
  DeriveLessonContentArgs,
  getFinalUnlockedListKey,
  getRandomQuizChallenge,
  getReviewLessonSet,
} from "@src/tools/utils";
import { CUSTOM_WORD_LIST_TITLE } from "@tests/mocks";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class HomeScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { lessons } = this.props;

    const totalWordsHsk = lessons.reduce(
      (total, lesson) =>
        !Boolean(lesson.title) ? total + lesson.content.length : total,
      0,
    );

    const CUSTOM_WORD_LIST_EXISTS =
      lessons[lessons.length - 1].title === CUSTOM_WORD_LIST_TITLE;

    // Total garbage code
    const totalWordsMTC = lessons
      .slice(6, CUSTOM_WORD_LIST_EXISTS ? lessons.length - 2 : Infinity) // What!
      .reduce(
        (total, lesson) =>
          Boolean(lesson.title) ? total + lesson.content.length : total,
        0,
      );

    const generalVocabularyListWords = lessons[5].content.length;
    const customListWords = !CUSTOM_WORD_LIST_EXISTS
      ? 0
      : lessons[lessons.length - 1].content.length;

    const totalWordsCustomList = customListWords + generalVocabularyListWords;

    return (
      <ScrollContainer>
        <Text style={TextStyles}>HSK Vocabulary Lists</Text>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {totalWordsHsk.toLocaleString()} words total
        </Text>
        {this.renderListSets(true)}
        <Text style={{ ...TextStyles, marginTop: 20 }}>
          Mandarin Teaching Center Lessons
        </Text>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {totalWordsMTC.toLocaleString()} words total
        </Text>
        {this.renderListSets(false)}
        <Text style={{ ...TextStyles, marginTop: 20 }}>
          Vocabulary Practice
        </Text>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {totalWordsCustomList.toLocaleString()} words total
        </Text>
        {this.renderListSets(false, true)}
        <LineBreak />
        <Text style={TextStyles}>Practice everyday to gain experience!</Text>
        <ReviewLink onPress={this.openLessonSummarySpecial("DAILY_QUIZ")}>
          <Text style={{ fontWeight: "600" }}>Daily Challenge! 天天桔</Text>
          <Text>🍊</Text>
        </ReviewLink>
        <ReviewLink
          style={{ marginTop: 6 }}
          onPress={this.openLessonSummarySpecial("SUMMARY")}
        >
          <Text style={{ fontWeight: "600" }}>Review All Unlocked Content</Text>
          <Text>🗃</Text>
        </ReviewLink>
      </ScrollContainer>
    );
  }

  renderListSets = (hsk: boolean, custom = false) => {
    const { lessons, userScoreStatus } = this.props;
    const unlockedListIndex = getFinalUnlockedListKey(userScoreStatus);

    if (custom) {
      const generalVocabularyList = lessons[5];
      const GeneralVocabulary = (
        <LessonBlock
          key={generalVocabularyList.list}
          style={{ backgroundColor: COLORS.lessonCustomList }}
          onPress={this.handleSelectList(
            generalVocabularyList.list,
            generalVocabularyList,
            5,
            false,
          )}
        >
          <LessonBlockText isLocked={false}>
            {generalVocabularyList.title}
          </LessonBlockText>
          <LessonBlockText isLocked={false}>
            ({generalVocabularyList.content.length.toLocaleString()} words)
          </LessonBlockText>
        </LessonBlock>
      );

      const index = lessons.length - 1;
      const hskList = lessons[index];
      if (hskList.title === CUSTOM_WORD_LIST_TITLE) {
        const CustomList = (
          <LessonBlock
            key={hskList.list}
            style={{ backgroundColor: COLORS.lessonCustomList }}
            onPress={this.handleSelectList(hskList.list, hskList, index, false)}
          >
            <LessonBlockText isLocked={false}>{hskList.title}</LessonBlockText>
            <LessonBlockText isLocked={false}>
              ({hskList.content.length.toLocaleString()} words)
            </LessonBlockText>
          </LessonBlock>
        );

        return [GeneralVocabulary, CustomList];
      } else {
        return [GeneralVocabulary];
      }
    }

    return lessons
      .map((hskList, index) => {
        const { list, title, locked, content } = hskList;
        const inProgress = index === unlockedListIndex;
        const isLocked = locked ? index > unlockedListIndex : false;
        const listTitle = title ? title : `HSK Level ${list}`;

        if (title && hsk) {
          return null; // hsk lessons
        } else if (!title && !hsk) {
          return null; // custom lessons
        } else if (title === "General Vocabulary") {
          return null; // Total shit!
        } else if (title === CUSTOM_WORD_LIST_TITLE) {
          return null;
        }

        return (
          <LessonBlock
            key={hskList.list}
            style={{
              backgroundColor: !locked
                ? COLORS.lessonMTC
                : isLocked
                ? COLORS.lockedLessonBlock
                : inProgress
                ? COLORS.lessonBlockInProgress
                : COLORS.lessonBlock,
            }}
            onPress={this.handleSelectList(list, hskList, index, isLocked)}
          >
            <LessonBlockText isLocked={isLocked}>{listTitle}</LessonBlockText>
            <LessonBlockText isLocked={isLocked}>
              ({content.length.toLocaleString()} words)
            </LessonBlockText>
          </LessonBlock>
        );
      })
      .filter(Boolean);
  };

  handleSelectList = (
    listKey: string,
    hskList: HSKList,
    index: number,
    isLocked: boolean,
  ) => () => {
    if (isLocked) {
      this.props.setToastMessage("Please complete the previous lesson first");
    } else {
      this.openListSummary(listKey, hskList, index)();
    }
  };

  openListSummary = (
    listKey: string,
    list: HSKList,
    listIndex: number,
    type: LessonSummaryType = "LESSON",
  ) => () => {
    const hskList = adjustListContentByDifficultySetting(
      list.content,
      this.props.appDifficultySetting,
    );
    const params: ListScreenParams = {
      type,
      listKey,
      hskList,
      listIndex,
      listTitle: list.title,
    };
    this.props.navigation.navigate(ROUTE_NAMES.LIST_SUMMARY, params);
  };

  openLessonSummarySpecial = (type: LessonSummaryType) => () => {
    const { lessons, userScoreStatus, appDifficultySetting } = this.props;
    const unlockedLessonIndex = getFinalUnlockedListKey(userScoreStatus);
    const args: DeriveLessonContentArgs = {
      lists: lessons,
      unlockedListIndex: unlockedLessonIndex,
      appDifficultySetting,
      userScoreStatus,
    };
    const dailyQuizSet = getRandomQuizChallenge(args);
    const reviewSet = getReviewLessonSet(args);
    const lesson = type === "DAILY_QUIZ" ? dailyQuizSet : reviewSet;

    const params: LessonScreenParams = {
      type,
      lesson,
      listIndex: Infinity,
      lessonIndex: Infinity,
      isFinalLesson: false,
      isFinalUnlockedLesson: false,
    };

    this.props.navigation.navigate(ROUTE_NAMES.LESSON_SUMMARY, params);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

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
          textDecorationLine: "none",
        }) as TextStyle,
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(HomeScreenComponent);
