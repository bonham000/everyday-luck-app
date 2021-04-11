import styled from "@emotion/native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import {
  LessonBlock,
  LessonBlockText,
  ScrollContainer,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  ContentList,
  ContentListType,
  LessonScreenParams,
  LessonSummaryType,
  ListScreenParams,
  SentenceScreenParams,
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

    const ContemporaryChineseTotalWords = lessons
      .filter(x => x.type === "Contemporary Chinese")
      .reduce((total, list) => total + list.content.length, 0);
    const FarEastTotalWords = lessons
      .filter(x => x.type === "Far East")
      .reduce((total, list) => total + list.content.length, 0);
    const SentencesContent = lessons
      .filter(x => x.type === "Sentences")
      .reduce((total, list) => total + list.content.length, 0);

    const generalVocabularyListWords = lessons[5].content.length;
    const customListWords = !CUSTOM_WORD_LIST_EXISTS
      ? 0
      : lessons[lessons.length - 1].content.length;

    const totalWordsCustomList = customListWords + generalVocabularyListWords;

    return (
      <ScrollContainer>
        <BoldText>HSK Vocabulary Lists</BoldText>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {totalWordsHsk.toLocaleString()} words total
        </Text>
        {this.renderListSets(true, false, "HSK")}
        <BoldText style={{ marginTop: 20 }}>
          A Course in Contemporary Chinese
        </BoldText>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {ContemporaryChineseTotalWords.toLocaleString()} words total
        </Text>
        {this.renderListSets(false, false, "Contemporary Chinese")}
        <BoldText style={{ marginTop: 20 }}>Far East Textbook</BoldText>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {FarEastTotalWords.toLocaleString()} words total
        </Text>
        {this.renderListSets(false, false, "Far East")}
        <BoldText style={{ marginTop: 20 }}>Vocabulary Practice</BoldText>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {totalWordsCustomList.toLocaleString()} words total
        </Text>
        {this.renderListSets(false, true, "Custom Word List")}
        <BoldText style={{ marginTop: 20 }}>Sentences Practice</BoldText>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {SentencesContent.toLocaleString()} total sentences
        </Text>
        {this.renderListSets(false, false, "Sentences")}
        <LineBreak />
        <BoldText style={{ marginBottom: 16 }}>
          Practice everyday to gain experience!
        </BoldText>
        <ReviewLink onPress={this.openLessonSummarySpecial("DAILY_QUIZ")}>
          <LessonBlockText>Daily Challenge! 天天桔</LessonBlockText>
          <Text>🍊</Text>
        </ReviewLink>
        <ReviewLink
          style={{ marginTop: 6 }}
          onPress={this.openLessonSummarySpecial("SUMMARY")}
        >
          <LessonBlockText>Review All Unlocked Content</LessonBlockText>
          <Text>🗃</Text>
        </ReviewLink>
      </ScrollContainer>
    );
  }

  renderListSets = (hsk: boolean, custom: boolean, type: ContentListType) => {
    const { lessons, userScoreStatus } = this.props;
    const unlockedListIndex = getFinalUnlockedListKey(userScoreStatus);

    if (custom) {
      const generalVocabularyList = lessons[5];
      const GeneralVocabulary = (
        <LessonBlock
          key={generalVocabularyList.list}
          style={{ backgroundColor: COLORS.lessonCustomList, width: "90%" }}
          onPress={this.handleSelectList(
            generalVocabularyList.list,
            generalVocabularyList,
            5,
            false,
          )}
        >
          <LessonBlockText mtcLesson={false} isLocked={false}>
            {generalVocabularyList.title}
          </LessonBlockText>
          <LessonBlockText mtcLesson={false} isLocked={false}>
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
            style={{ backgroundColor: COLORS.lessonCustomList, width: "90%" }}
            onPress={this.handleSelectList(hskList.list, hskList, index, false)}
          >
            <LessonBlockText mtcLesson={false} isLocked={false}>
              {hskList.title}
            </LessonBlockText>
            <LessonBlockText mtcLesson={false} isLocked={false}>
              ({hskList.content.length.toLocaleString()} words)
            </LessonBlockText>
          </LessonBlock>
        );

        return [GeneralVocabulary, CustomList];
      } else {
        return [GeneralVocabulary];
      }
    }

    let lessonSlice;

    if (type === "HSK") {
      lessonSlice = lessons.filter(x => x.type === "HSK");
    } else if (type === "Contemporary Chinese") {
      lessonSlice = lessons.filter(x => x.type === "Contemporary Chinese");
    } else if (type === "Far East") {
      lessonSlice = lessons.filter(x => x.type === "Far East");
    } else if (type === "Sentences") {
      lessonSlice = lessons.filter(x => x.type === "Sentences");
    } else {
      return null;
    }

    return lessonSlice
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

        const mtcLesson = !!title;

        return (
          <LessonBlock
            type={type}
            key={hskList.list}
            hskLocked={locked}
            isLocked={isLocked}
            inProgress={inProgress}
            style={{ width: "90%" }}
            onPress={this.handleSelectList(list, hskList, index, isLocked)}
          >
            <LessonBlockText mtcLesson={mtcLesson} isLocked={isLocked}>
              {listTitle}
            </LessonBlockText>
            <LessonBlockText mtcLesson={false} isLocked={isLocked}>
              ({content.length.toLocaleString()}{" "}
              {type === "Sentences" ? "sentences" : "words"})
            </LessonBlockText>
          </LessonBlock>
        );
      })
      .filter(Boolean);
  };

  handleSelectList = (
    listKey: string | undefined,
    hskList: ContentList,
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
    key: string | undefined,
    list: ContentList,
    listIndex: number,
    type: LessonSummaryType = "LESSON",
  ) => () => {
    const listKey = String(key);
    const hskList = adjustListContentByDifficultySetting(
      list.content,
      this.props.appDifficultySetting,
    );
    const params: ListScreenParams = {
      id: list.id,
      contentType: list.type,
      type,
      listKey,
      hskList,
      listIndex,
      listTitle: list.title,
      dictation: list.dictation,
    };
    if (list.type === "Sentences") {
      const sentenceParams: SentenceScreenParams = {
        id: list.id,
        listKey,
        sentences: list.content,
        contentType: "Sentences",
        listTitle: String(list.title),
      };
      this.props.navigation.navigate(
        ROUTE_NAMES.SENTENCES_SUMMARY,
        sentenceParams,
      );
    } else {
      this.props.navigation.navigate(ROUTE_NAMES.LIST_SUMMARY, params);
    }
  };

  openLessonSummarySpecial = (type: LessonSummaryType) => () => {
    const { lessons, userScoreStatus, appDifficultySetting } = this.props;
    const unlockedLessonIndex = getFinalUnlockedListKey(userScoreStatus);
    const args: DeriveLessonContentArgs = {
      listId: "Special",
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
      listKey: "",
      id: "special",
      contentType: "Special",
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

const ReviewLink = styled.TouchableOpacity({
  width: "90%",
  height: 50,
  padding: 12,
  margin: 4,
  borderRadius: 5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.actionButtonMint,
});

const BoldText = styled.Text<any>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const Text = styled.Text<any>`
  font-size: 16px;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const LineBreak = styled.View<any>`
  width: 85%;
  margin-top: 16px;
  margin-bottom: 16px;
  height: 1px;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.dark};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(HomeScreenComponent);
