import glamorous from "glamorous-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

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
import { LessonScreenParams } from "@src/tools/types";
import {
  DeriveLessonContentArgs,
  getLessonSummaryStatus,
  getRandomQuizChallenge,
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
    const listIndex = navigation.getParam("listIndex");
    const listTitle = navigation.getParam("listTitle");
    const isFinalUnlockedLesson = navigation.getParam("isFinalUnlockedLesson");
    const isLesson = type === "LESSON";
    const {
      mcEnglish,
      mcMandarin,
      quizText,
      mandarinPronunciation,
    } = getLessonSummaryStatus(
      isFinalUnlockedLesson,
      userScoreStatus,
      listIndex,
    );
    const IS_DAILY_QUIZ = type === "DAILY_QUIZ";
    const IS_OPT_OUT_CHALLENGE = type === "OPT_OUT_CHALLENGE";
    const NON_RANDOM_QUIZ =
      type !== "DAILY_QUIZ" && type !== "OPT_OUT_CHALLENGE";
    return (
      <ScrollContainer>
        {this.renderTitleText()}
        {this.renderSubText()}
        {NON_RANDOM_QUIZ && <Text style={SectionTextStyles}>Practice</Text>}
        {IS_DAILY_QUIZ && (
          <React.Fragment>
            <LineBreak />
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.DAILY_CHALLENGE,
              )}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>
                Start the Quiz!
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
              <Text>English Recognition</Text>
              {mcEnglish && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN,
              )}
            >
              <Text>Mandarin Recognition</Text>
              {mcMandarin && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(
                ROUTE_NAMES.MULTIPLE_CHOICE_VOICE,
              )}
            >
              <Text>Mandarin Pronunciation</Text>
              {mandarinPronunciation && isLesson && <Text>💯</Text>}
            </ActionBlock>
            <ActionBlock
              onPress={this.handleNavigateToSection(ROUTE_NAMES.QUIZ)}
            >
              <Text>Characters Quiz</Text>
              {quizText && isLesson && <Text>💯</Text>}
            </ActionBlock>
          </React.Fragment>
        )}
        {NON_RANDOM_QUIZ && (
          <React.Fragment>
            <Text style={SectionTextStyles}>Practice</Text>
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
            <Text style={SectionTextStyles}>Study</Text>
            <LineBreak />
            <ActionBlock
              style={{ backgroundColor: COLORS.actionButtonMint }}
              onPress={this.handleNavigateToSection(ROUTE_NAMES.FLASHCARDS)}
            >
              <Text>Flashcards</Text>
              <Text>📑</Text>
            </ActionBlock>
            <ActionBlock
              style={{ backgroundColor: COLORS.actionButtonMint }}
              onPress={this.handleNavigateToSection(ROUTE_NAMES.VIEW_ALL)}
            >
              <Text>Review All Content</Text>
              <Text>🗃</Text>
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
            <InfoText>
              The 4 quiz options will be mixed randomly within the quiz for a
              more interesting challenge - enjoy!
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

  renderTitleText = () => {
    const type = this.props.navigation.getParam("type");
    const listIndex = this.props.navigation.getParam("listIndex");
    return (
      <React.Fragment>
        {type === "LESSON" && <Text style={TextStyles}>Lesson Summary</Text>}
        {type === "SUMMARY" && <Text style={TextStyles}>Content Summary</Text>}
        {type === "DAILY_QUIZ" && (
          <Text style={TextStyles}>Daily Quiz - 天天桔 🍊</Text>
        )}
        {type === "OPT_OUT_CHALLENGE" &&
          (listIndex > 4 ? (
            <Text style={TextStyles}>Test!</Text>
          ) : (
            <Text style={TextStyles}>HSK Test</Text>
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
          <Text style={SubTextStyles}>
            {COUNT} total words to practice in this lesson
          </Text>
        )}
        {type === "SUMMARY" && (
          <Text style={SubTextStyles}>
            This is a summary of all unlocked content. There are {COUNT} to
            review.
          </Text>
        )}
        {type === "DAILY_QUIZ" && (
          <Text style={SubTextStyles}>
            There are {COUNT} random words selected for you! Practicing daily is
            the best way to build up experience points!
          </Text>
        )}
        {type === "OPT_OUT_CHALLENGE" &&
          (listIndex > 4 ? (
            <Text style={SubTextStyles}>
              There are {COUNT} random words selected. If you can pass the quiz
              with a perfect score you will unlock all the content here.
            </Text>
          ) : (
            <Text style={SubTextStyles}>
              There are {COUNT} random words selected. If you can pass the quiz
              with a perfect score you will unlock the next HSK Level!
            </Text>
          ))}
      </React.Fragment>
    );
  };

  getNextScreenParams = (): LessonScreenParams => {
    const type = this.props.navigation.getParam("type");
    const lesson = this.props.navigation.getParam("lesson");
    const listIndex = this.props.navigation.getParam("listIndex");
    const lessonIndex = this.props.navigation.getParam("lessonIndex");
    const isFinalLesson = this.props.navigation.getParam("isFinalLesson");
    const isFinalUnlockedLesson = this.props.navigation.getParam(
      "isFinalUnlockedLesson",
    );

    const params: LessonScreenParams = {
      type,
      lesson,
      listIndex,
      lessonIndex,
      isFinalLesson,
      isFinalUnlockedLesson,
    };

    return params;
  };

  handleNavigateToSection = (routeName: ROUTE_NAMES) => () => {
    const params = this.getNextScreenParams();
    this.props.navigation.navigate(routeName, params);
  };

  handleNavigateToHskTest = (routeName: ROUTE_NAMES) => () => {
    const { lessons, userScoreStatus } = this.props;
    const listIndex = this.props.navigation.getParam("listIndex");

    /**
     * Rebuild the random quiz set each time the user accesses it - the
     * content should always be randomized from the list.
     */
    const args: DeriveLessonContentArgs = {
      lists: lessons,
      unlockedListIndex: listIndex,
      appDifficultySetting: OPT_OUT_LEVEL,
      userScoreStatus,
      limitToCurrentList: true,
    };
    const randomQuizSet = getRandomQuizChallenge(args);

    const params: LessonScreenParams = {
      ...this.getNextScreenParams(),
      lesson: randomQuizSet,
    };
    this.props.navigation.navigate(routeName, params);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TextStyles = {
  fontSize: 16,
  width: "88%",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 16,
};

const SubTextStyles = {
  fontSize: 16,
  width: "85%",
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
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const InfoText = glamorous.text({
  textAlign: "center",
  width: "85%",
  marginTop: 15,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(
  withSoundRecordingContext(LessonSummaryScreenComponent),
);
