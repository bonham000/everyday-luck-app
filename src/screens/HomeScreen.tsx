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
  GrammarScreenParams,
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
    const GrammarContent = lessons
      .filter(x => x.type === "Grammar")
      .reduce((total, list) => total + list.content.length, 0);
    const VocabularyContent = lessons
      .filter(x => x.type === "General Vocabulary")
      .reduce((total, list) => total + list.content.length, 0);

    const customListWords = !CUSTOM_WORD_LIST_EXISTS
      ? 0
      : lessons[lessons.length - 1].content.length;

    const totalWordsCustomList = customListWords + VocabularyContent;

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
        <BoldText style={{ marginTop: 20 }}>Grammar Practice</BoldText>
        <Text style={{ marginTop: 6, marginBottom: 18 }}>
          {GrammarContent.toLocaleString()} total examples
        </Text>
        {this.renderListSets(false, false, "Grammar")}
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
        <ReviewLink onPress={this.openGrammarReviewAll}>
          <LessonBlockText>Review All Grammar</LessonBlockText>
          <Text>📑</Text>
        </ReviewLink>
      </ScrollContainer>
    );
  }

  renderListSets = (hsk: boolean, custom: boolean, type: ContentListType) => {
    const { lessons, userScoreStatus } = this.props;
    const unlockedListIndex = getFinalUnlockedListKey(userScoreStatus);

    if (custom) {
      const generalVocabularyLists = lessons.filter(
        x =>
          x.type === "General Vocabulary" ||
          x.type === "Custom Word List" ||
          x.type === "Bookmarked Word List",
      );

      const GeneralVocabulary = (
        <React.Fragment>
          {generalVocabularyLists.map((generalVocabularyList, index) => {
            if (generalVocabularyList.type === "Custom Word List") {
              return (
                <LessonBlock
                  key="custom-word-list"
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.lessonBookmarkedList,
                  }}
                  onPress={this.handleSelectList(
                    generalVocabularyList.list,
                    generalVocabularyList,
                    index,
                    false,
                  )}
                >
                  <LessonBlockText mtcLesson={false} isLocked={false}>
                    {generalVocabularyList.title}
                  </LessonBlockText>
                  <LessonBlockText mtcLesson={false} isLocked={false}>
                    ({generalVocabularyList.content.length.toLocaleString()}{" "}
                    words)
                  </LessonBlockText>
                </LessonBlock>
              );
            } else if (generalVocabularyList.type === "Bookmarked Word List") {
              return (
                <LessonBlock
                  key="bookmarked-list"
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.lessonBookmarkedList,
                  }}
                  onPress={this.handleSelectList(
                    generalVocabularyList.list,
                    generalVocabularyList,
                    index,
                    false,
                  )}
                >
                  <LessonBlockText mtcLesson={false} isLocked={false}>
                    {generalVocabularyList.title}
                  </LessonBlockText>
                  <LessonBlockText mtcLesson={false} isLocked={false}>
                    ({generalVocabularyList.content.length.toLocaleString()}{" "}
                    words)
                  </LessonBlockText>
                </LessonBlock>
              );
            }

            return (
              <LessonBlock
                key={generalVocabularyList.id + index}
                style={{
                  width: "90%",
                  backgroundColor:
                    index === 0
                      ? COLORS.lessonFrequencyList
                      : COLORS.lessonCustomList,
                }}
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
                  ({generalVocabularyList.content.length.toLocaleString()}{" "}
                  words)
                </LessonBlockText>
              </LessonBlock>
            );
          })}
        </React.Fragment>
      );

      return [GeneralVocabulary];
    }

    let lessonSlice;

    if (type === "HSK") {
      lessonSlice = lessons.filter(x => x.type === "HSK");
    } else if (type === "Contemporary Chinese") {
      lessonSlice = lessons.filter(x => x.type === "Contemporary Chinese");
    } else if (type === "Far East") {
      lessonSlice = lessons.filter(x => x.type === "Far East");
    } else if (type === "Grammar") {
      lessonSlice = lessons.filter(x => x.type === "Grammar");
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
            index={index}
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
              {type === "Grammar" ? "examples" : "words"})
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
    if (list.type === "Grammar") {
      const sentenceParams: GrammarScreenParams = {
        id: list.id,
        listKey,
        content: list.content,
        contentType: "Grammar",
        listTitle: String(list.title),
      };
      this.props.navigation.navigate(
        ROUTE_NAMES.GRAMMAR_SUMMARY,
        sentenceParams,
      );
    } else {
      this.props.navigation.navigate(ROUTE_NAMES.LIST_SUMMARY, params);
    }
  };

  openGrammarReviewAll = () => {
    const { lessons } = this.props;
    const grammar = lessons
      .filter(x => x.type === "Grammar")
      .map(l => l.content)
      .reduce((flattened, lesson) => flattened.concat(lesson));

    const sentenceParams: GrammarScreenParams = {
      id: "review",
      listKey: "1",
      content: grammar,
      contentType: "Grammar",
      listTitle: "Review All Grammar",
    };
    this.props.navigation.navigate(ROUTE_NAMES.GRAMMAR_SUMMARY, sentenceParams);
  };

  openLessonSummarySpecial = (type: LessonSummaryType) => () => {
    const {
      lessons,
      quizCacheSet,
      userScoreStatus,
      appDifficultySetting,
      handleUpdateUserSettingsField,
    } = this.props;
    const unlockedLessonIndex = getFinalUnlockedListKey(userScoreStatus);
    const args: DeriveLessonContentArgs = {
      listId: "Special",
      quizCacheSet,
      lists: lessons,
      userScoreStatus,
      appDifficultySetting,
      unlockedListIndex: unlockedLessonIndex,
    };
    const {
      result: dailyQuizSet,
      quizCacheSet: quizCacheSetUpdated,
    } = getRandomQuizChallenge(args);
    const reviewSet = getReviewLessonSet(args);
    const lesson = type === "DAILY_QUIZ" ? dailyQuizSet : reviewSet;

    // Update Quiz Cache Set after the quiz selection
    handleUpdateUserSettingsField({ quizCacheSet: quizCacheSetUpdated });

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
