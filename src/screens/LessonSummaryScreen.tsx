import styled from "@emotion/native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { Bold, ScrollContainer } from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import { OPT_OUT_LEVEL } from "@src/providers/GlobalStateContext";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import {
  SoundRecordingProps,
  withSoundRecordingContext,
} from "@src/providers/SoundRecordingProvider";
import { LessonScreenParams, ShuffleQuizType } from "@src/tools/types";
import {
  DeriveLessonContentArgs,
  getLessonSummaryStatus,
  getRandomQuizChallenge,
  summarizeDailyQuizStats,
} from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps, SoundRecordingProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class LessonSummaryScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { navigation, userScoreStatus } = this.props;
    const type = navigation.getParam("type");
    const listId = navigation.getParam("id");
    const listTitle = navigation.getParam("listTitle");
    const isFinalUnlockedLesson = navigation.getParam("isFinalUnlockedLesson");
    const isLesson = type === "LESSON";
    const {
      mcEnglish,
      mcMandarin,
      quizText,
      quizTextReverse,
      mandarinPronunciation,
    } = getLessonSummaryStatus(isFinalUnlockedLesson, userScoreStatus, listId);
    const IS_SHUFFLE_QUIZ = type === "SHUFFLE_QUIZ";
    const IS_DAILY_QUIZ = type === "DAILY_QUIZ";
    const IS_OPT_OUT_CHALLENGE = type === "OPT_OUT_CHALLENGE";
    const NON_RANDOM_QUIZ =
      type !== "SHUFFLE_QUIZ" &&
      type !== "DAILY_QUIZ" &&
      type !== "OPT_OUT_CHALLENGE";

    return (
      <ScrollContainer>
        {this.renderTitleText()}
        {this.renderSubText()}
        {NON_RANDOM_QUIZ && <SectionTitleText>Quizzes</SectionTitleText>}
        {IS_DAILY_QUIZ && (
          <React.Fragment>
            <LineBreak />
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.DAILY_CHALLENGE,
              )}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
                Multiple Choice Only
              </Text>
              <Text>📟</Text>
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.DAILY_CHALLENGE,
                "characters",
              )}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
                Character Entry
              </Text>
              <Text>🏟</Text>
            </ActionBlock>
          </React.Fragment>
        )}
        {IS_SHUFFLE_QUIZ && (
          <React.Fragment>
            <LineBreak />
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.DAILY_CHALLENGE,
                "multiple-choice",
              )}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
                Multiple Choice Only
              </Text>
              <Text>📟</Text>
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.DAILY_CHALLENGE,
                "characters",
              )}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
                Character Entry
              </Text>
              <Text>🏟</Text>
            </ActionBlock>
          </React.Fragment>
        )}
        {IS_OPT_OUT_CHALLENGE && (
          <React.Fragment>
            <LineBreak />
            <ActionBlock
              onPress={this.handleNavigateToHskTest(ROUTE_NAMES.HSK_TEST_OUT)}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
                Accept the challenge!
              </Text>
              <Text>🔑</Text>
            </ActionBlock>
          </React.Fragment>
        )}
        {NON_RANDOM_QUIZ && (
          <React.Fragment>
            <LineBreak />
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH,
              )}
            >
              <Text>English Recognition Quiz</Text>
              {mcEnglish && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN,
              )}
            >
              <Text>Mandarin Recognition Quiz</Text>
              {mcMandarin && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.MULTIPLE_CHOICE_VOICE,
              )}
            >
              <Text>Listening Quiz</Text>
              {mandarinPronunciation && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(ROUTE_NAMES.QUIZ)}
            >
              <Text>Characters Quiz</Text>
              {quizText && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(ROUTE_NAMES.QUIZ_REVERSE)}
            >
              <Text>Characters Quiz Reverse</Text>
              {quizTextReverse && isLesson && <Text>💯</Text>}
            </ActionBlock>
          </React.Fragment>
        )}
        {NON_RANDOM_QUIZ && (
          <React.Fragment>
            <SectionTitleText>Practice</SectionTitleText>
            <LineBreak />
            <ActionBlock
              style={{ backgroundColor: COLORS.lessonCustomList }}
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.AUDIO_REVIEW_QUIZ,
              )}
            >
              <Text>Listening Quiz</Text>
              <Text>📱</Text>
            </ActionBlock>
            <ActionBlock
              style={{ backgroundColor: COLORS.lessonCustomList }}
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.CHARACTER_WRITING,
              )}
            >
              <Text>Character Writing</Text>
              <Text>🎨</Text>
            </ActionBlock>
            <SectionTitleText>Study</SectionTitleText>
            <LineBreak />
            <ActionBlock
              onPress={this.navigateToPracticeQuiz}
              style={{ backgroundColor: COLORS.actionButtonMint }}
            >
              <Text>Shuffle Quiz</Text>
              <Text>📟</Text>
            </ActionBlock>
            <ActionBlock
              style={{ backgroundColor: COLORS.actionButtonMint }}
              onPress={this.handleNavigateToSection(ROUTE_NAMES.VIEW_ALL)}
            >
              <Text>Review All Content</Text>
              <Text>🗃</Text>
            </ActionBlock>
            <ActionBlock
              style={{ backgroundColor: COLORS.actionButtonMint }}
              onPress={this.handleNavigateToSection(ROUTE_NAMES.FLASHCARDS)}
            >
              <Text>Flashcards</Text>
              <Text>📑</Text>
            </ActionBlock>
          </React.Fragment>
        )}
        {IS_DAILY_QUIZ && (
          <React.Fragment>
            <InfoText>
              Practice makes perfect! The <Bold>Daily Challenge</Bold> will
              prompt you each day with a quiz on the content you've already
              learned.
            </InfoText>
            {this.renderDailyQuizStats()}
          </React.Fragment>
        )}
        {IS_SHUFFLE_QUIZ && (
          <React.Fragment>
            <InfoText>
              You can choose between a mix of the multiple choice quiz type
              (easier) or the character entry quiz type (harder).
            </InfoText>
          </React.Fragment>
        )}
        {IS_OPT_OUT_CHALLENGE &&
          (!listTitle ? (
            <React.Fragment>
              <InfoText>
                Some intermediate Chinese learners will already have mastered
                some of the basic content and this gives them an option to skip
                through the earlier lessons quickly.
              </InfoText>
              <InfoText>
                You must pass the quiz with a perfect score and the quiz is
                reshuffled on each attempt, so you will have to know of all the
                content at this level pretty well to pass.
              </InfoText>
              <InfoText style={{ fontWeight: "bold" }}>Good luck! 🍀</InfoText>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <InfoText>
                You must pass the quiz with a perfect score and the quiz is
                reshuffled on each attempt, so you will have to know of all the
                content at this level pretty well to pass.
              </InfoText>
              <InfoText style={{ fontWeight: "bold" }}>Good luck! 🍀</InfoText>
            </React.Fragment>
          ))}
      </ScrollContainer>
    );
  }

  renderDailyQuizStats = () => {
    const { lessons, quizCacheSet } = this.props;
    const {
      failedCount,
      reviewedCount,
      totalContentItems,
      percentReviewed,
    } = summarizeDailyQuizStats(lessons, quizCacheSet);
    return (
      <InfoText>
        You have reviewed <Bold>{reviewedCount}</Bold> total items out of a
        total of <Bold>{totalContentItems}</Bold>. There are{" "}
        <Bold>{failedCount}</Bold> failed items which will be reviewed again. In
        total, you have reviewed <Bold>{percentReviewed}%</Bold> of all unlocked
        content. Keep it up!
      </InfoText>
    );
  };

  renderTitleText = () => {
    const type = this.props.navigation.getParam("type");
    const listIndex = this.props.navigation.getParam("listIndex");
    return (
      <React.Fragment>
        {type === "LESSON" && <TitleText>Lesson Summary</TitleText>}
        {type === "SUMMARY" && <TitleText>Content Summary</TitleText>}
        {type === "SHUFFLE_QUIZ" && <TitleText>Shuffle Quiz</TitleText>}
        {type === "DAILY_QUIZ" && <TitleText>Daily Quiz - 天天桔 🍊</TitleText>}
        {type === "OPT_OUT_CHALLENGE" &&
          (listIndex > 4 ? (
            <TitleText>Test!</TitleText>
          ) : (
            <TitleText>HSK Test</TitleText>
          ))}
      </React.Fragment>
    );
  };

  renderSubText = () => {
    const type = this.props.navigation.getParam("type");
    const lesson = this.props.navigation.getParam("lesson");
    const listIndex = this.props.navigation.getParam("listIndex");
    const COUNT = lesson.length;
    return (
      <React.Fragment>
        {type === "LESSON" && (
          <SubText>{COUNT} total words to practice in this lesson</SubText>
        )}
        {type === "SUMMARY" && (
          <SubText>
            This is a summary of all unlocked content. There are {COUNT} to
            review.
          </SubText>
        )}
        {type === "DAILY_QUIZ" && (
          <SubText>
            There are {COUNT} random words selected for you! Practicing daily is
            the best way to build up experience points!
          </SubText>
        )}
        {type === "SHUFFLE_QUIZ" && (
          <SubText>
            This is a good way to review the content in this lesson.
          </SubText>
        )}
        {type === "OPT_OUT_CHALLENGE" &&
          (listIndex > 4 ? (
            <SubText>
              There are {COUNT} random words selected. If you can pass the quiz
              with a perfect score you will unlock all the content here.
            </SubText>
          ) : (
            <SubText>
              There are {COUNT} random words selected. If you can pass the quiz
              with a perfect score you will unlock the next HSK Level!
            </SubText>
          ))}
      </React.Fragment>
    );
  };

  getNextScreenParams = (
    shuffleQuizType?: ShuffleQuizType,
  ): LessonScreenParams => {
    const type = this.props.navigation.getParam("type");
    const lesson = this.props.navigation.getParam("lesson");
    const id = this.props.navigation.getParam("id");
    const contentType = this.props.navigation.getParam("contentType");
    const listIndex = this.props.navigation.getParam("listIndex");
    const listKey = this.props.navigation.getParam("listKey");
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const isFinalLesson = this.props.navigation.getParam("isFinalLesson");
    const isFinalUnlockedLesson = this.props.navigation.getParam(
      "isFinalUnlockedLesson",
    );

    const params: LessonScreenParams = {
      id,
      type,
      lesson,
      listIndex,
      listKey,
      contentType,
      lessonIndex,
      isFinalLesson,
      shuffleQuizType,
      isFinalUnlockedLesson,
    };

    return params;
  };

  handleNavigateToSection = (
    routeName: ROUTE_NAMES,
    type?: ShuffleQuizType,
  ) => () => {
    const params = this.getNextScreenParams(type);
    this.props.navigation.navigate(routeName, params);
  };

  handleNavigateToHskTest = (routeName: ROUTE_NAMES) => () => {
    const { lessons, userScoreStatus } = this.props;
    const id = this.props.navigation.getParam("id");
    const lesson = this.props.navigation.getParam("lesson");
    const contentType = this.props.navigation.getParam("contentType");
    const IS_HSK = contentType === "HSK";
    const listIndex = this.props.navigation.getParam("listIndex");

    /**
     * Rebuild the random quiz set each time the user accesses it - the
     * content should always be randomized from the list.
     */
    const args: DeriveLessonContentArgs = {
      listId: id,
      lists: lessons,
      userScoreStatus,
      quizCacheSet: {},
      limitToCurrentList: true,
      unlockedListIndex: listIndex,
      appDifficultySetting: OPT_OUT_LEVEL,
    };
    const { result: randomQuizSet } = getRandomQuizChallenge(args);

    const params: LessonScreenParams = {
      ...this.getNextScreenParams(),
      lesson: IS_HSK ? randomQuizSet : lesson,
    };
    this.props.navigation.navigate(routeName, params);
  };

  navigateToPracticeQuiz = () => {
    const lesson = this.props.navigation.getParam("lesson");
    const id = this.props.navigation.getParam("id");
    const listKey = this.props.navigation.getParam("listKey");
    const contentType = this.props.navigation.getParam("contentType");
    const params: LessonScreenParams = {
      id,
      lesson,
      listKey,
      contentType,
      type: "SHUFFLE_QUIZ",
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

const TitleText = styled.Text<any>`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const SectionTitleText = styled.Text<any>`
  width: 88%;
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
  text-align: left;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const SubText = styled.Text<any>`
  font-size: 16px;
  width: 85%;
  text-align: center;
  margin-bottom: 16px;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

const ActionBlock = styled.TouchableOpacity({
  width: "90%",
  height: 50,
  margin: 6,
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.lessonBlock,
});

const LineBreak = styled.View<any>`
  width: 85%;
  margin-top: 12;
  margin-bottom: 12;
  height: 1px;

  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.fadedText : COLORS.darkText};
`;

const InfoText = styled.Text<any>`
  width: 85%;
  text-align: center;
  margin-top: 15px;

  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.textDarkTheme : COLORS.darkText};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(LessonSummaryScreenComponent),
);
