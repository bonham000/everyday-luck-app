import React from "react";
import { StargazerRouteConfigObject } from "react-native-stargazer";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { QUIZ_TYPE } from "@src/providers/GlobalStateContext";
import AboutScreenComponent from "@src/screens/AboutScreen";
import { ContactScreenComponent } from "@src/screens/ContactScreen";
import { FlashcardsScreenComponent } from "@src/screens/FlashcardsScreen";
import { GoogleSigninScreenComponent } from "@src/screens/GoogleSigninScreen";
import { HomeScreenComponent } from "@src/screens/HomeScreen";
import IntroScreenComponent from "@src/screens/IntroScreen";
import { LessonSummaryScreenComponent } from "@src/screens/LessonSummaryScreen";
import { ListSummaryScreenComponent } from "@src/screens/ListSummaryScreen";
import { QuizScreenComponent } from "@src/screens/QuizScreen";
import { SettingsScreenComponent } from "@src/screens/SettingsScreen";
import { TranslationScreenComponent } from "@src/screens/TranslationScreen";
import { ViewAllScreenComponent } from "@src/screens/ViewAllScreen";
import { LessonScreenParams, ListScreenParams } from "@src/tools/types";
import MOCKS from "@tests/data";

/** ========================================================================
 * Stargazer Route Config
 * =========================================================================
 */

interface StargazerRouteProps<Params = {}> {
  navigation: NavigationScreenProp<{}, Params>;
  screenProps: {
    viewRef: any;
    captureImage: (photoData: any, finalScreen?: boolean) => Promise<void>;
  };
}

const stargazerConfig: ReadonlyArray<StargazerRouteConfigObject> = [
  {
    name: "Google Sign In",
    screenName: ROUTE_NAMES.SIGNIN,
    screen: (props: StargazerRouteProps) => (
      <GoogleSigninScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
      />
    ),
  },
  {
    name: "Home Screen",
    screenName: ROUTE_NAMES.HOME,
    screen: (props: StargazerRouteProps) => (
      <HomeScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "Lesson Summary Screen",
    screenName: ROUTE_NAMES.LESSON_SUMMARY,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <LessonSummaryScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LIST_SCREEN_PARAMS,
  },
  {
    name: "List Summary Screen",
    screenName: ROUTE_NAMES.LIST_SUMMARY,
    screen: (props: StargazerRouteProps<ListScreenParams>) => (
      <ListSummaryScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "English Multiple Choice",
    screenName: ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.ENGLISH}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "Chinese Multiple Choice",
    screenName: ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.MANDARIN}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "Audio Multiple Choice",
    screenName: ROUTE_NAMES.MULTIPLE_CHOICE_VOICE,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.PRONUNCIATION}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "Characters Quiz",
    screenName: ROUTE_NAMES.QUIZ,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.QUIZ_TEXT}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "Flashcards Screen",
    screenName: ROUTE_NAMES.FLASHCARDS,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <FlashcardsScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
      />
    ),
    paramsForNextScreen: MOCKS.LESSON_SCREEN_PARAMS,
  },
  {
    name: "View All Screen",
    screenName: ROUTE_NAMES.VIEW_ALL,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <ViewAllScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
        {...MOCKS.SOUND_RECORDING_PROPS}
      />
    ),
  },
  {
    name: "Translation Screen",
    screenName: ROUTE_NAMES.TRANSLATION,
    screen: (props: StargazerRouteProps) => (
      <TranslationScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
      />
    ),
  },
  {
    name: "Settings Screen",
    screenName: ROUTE_NAMES.SETTINGS,
    screen: (props: StargazerRouteProps) => (
      <SettingsScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
      />
    ),
  },
  {
    name: "About Screen",
    screenName: ROUTE_NAMES.ABOUT,
    screen: (props: StargazerRouteProps) => (
      <AboutScreenComponent navigation={props.navigation} />
    ),
  },
  {
    name: "Intro Screen",
    screenName: ROUTE_NAMES.INTRO,
    screen: (props: StargazerRouteProps) => (
      <IntroScreenComponent navigation={props.navigation} />
    ),
  },
  {
    name: "Contact Screen",
    screenName: ROUTE_NAMES.CONTACT,
    screen: (props: StargazerRouteProps) => (
      <ContactScreenComponent
        navigation={props.navigation}
        {...MOCKS.GLOBAL_STATE_PROPS}
      />
    ),
  },
];

/** ========================================================================
 * Export
 * =========================================================================
 */

export default stargazerConfig;
