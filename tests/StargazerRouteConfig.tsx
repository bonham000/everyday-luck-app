import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { QUIZ_TYPE } from "@src/providers/GlobalStateContext";
import AboutScreenComponent from "@src/screens/AboutScreen";
import { ContactScreenComponent } from "@src/screens/ContactScreen";
import { FlashcardsScreenComponent } from "@src/screens/FlashcardsScreen";
import { GoogleSigninScreenComponent } from "@src/screens/GoogleSigninScreen";
import { HomeScreenComponent } from "@src/screens/HomeScreen";
import { LessonSummaryScreenComponent } from "@src/screens/LessonSummaryScreen";
import { ListSummaryScreenComponent } from "@src/screens/ListSummaryScreen";
import { QuizScreenComponent } from "@src/screens/QuizScreen";
import { SettingsScreenComponent } from "@src/screens/SettingsScreen";
import { TranslationScreenComponent } from "@src/screens/TranslationScreen";
import { ViewAllScreenComponent } from "@src/screens/ViewAllScreen";
import { LessonScreenParams, ListScreenParams } from "@src/tools/types";
import { StargazerRouteConfigObject } from "react-native-stargazer";
import {
  MockGlobalStateProps,
  MockLessonScreenParams,
  MockListScreenParams,
  MockSoundRecordingProps,
} from "./data";

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
        {...MockGlobalStateProps}
      />
    ),
  },
  {
    name: "Home Screen",
    screenName: ROUTE_NAMES.HOME,
    screen: (props: StargazerRouteProps) => (
      <HomeScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    name: "Lesson Summary Screen",
    screenName: ROUTE_NAMES.LESSON_SUMMARY,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <LessonSummaryScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockListScreenParams,
  },
  {
    name: "List Summary Screen",
    screenName: ROUTE_NAMES.LIST_SUMMARY,
    screen: (props: StargazerRouteProps<ListScreenParams>) => (
      <ListSummaryScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  // {
  //   name: "English Multiple Choice",
  //   screenName: ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH,
  //   screen: (props: StargazerRouteProps<LessonScreenParams>) => (
  //     <QuizScreenComponent
  //       navigation={props.navigation}
  //       quizType={QUIZ_TYPE.ENGLISH}
  //       {...MockGlobalStateProps}
  //       {...MockSoundRecordingProps}
  //     />
  //   ),
  //   paramsForNextScreen: MockLessonScreenParams,
  // },
  // {
  //   name: "Chinese Multiple Choice",
  //   screenName: ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN,
  //   screen: (props: StargazerRouteProps<LessonScreenParams>) => (
  //     <QuizScreenComponent
  //       navigation={props.navigation}
  //       quizType={QUIZ_TYPE.MANDARIN}
  //       {...MockGlobalStateProps}
  //       {...MockSoundRecordingProps}
  //     />
  //   ),
  //   paramsForNextScreen: MockLessonScreenParams,
  // },
  // {
  //   name: "Audio Multiple Choice",
  //   screenName: ROUTE_NAMES.MULTIPLE_CHOICE_VOICE,
  //   screen: (props: StargazerRouteProps<LessonScreenParams>) => (
  //     <QuizScreenComponent
  //       navigation={props.navigation}
  //       quizType={QUIZ_TYPE.PRONUNCIATION}
  //       {...MockGlobalStateProps}
  //       {...MockSoundRecordingProps}
  //     />
  //   ),
  //   paramsForNextScreen: MockLessonScreenParams,
  // },
  {
    name: "Characters Quiz",
    screenName: ROUTE_NAMES.QUIZ,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.QUIZ_TEXT}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    name: "Flashcards Screen",
    screenName: ROUTE_NAMES.FLASHCARDS,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <FlashcardsScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    name: "View All Screen",
    screenName: ROUTE_NAMES.VIEW_ALL,
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <ViewAllScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
  },
  {
    name: "Translation Screen",
    screenName: ROUTE_NAMES.TRANSLATION,
    screen: (props: StargazerRouteProps) => (
      <TranslationScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
  },
  {
    name: "Settings Screen",
    screenName: ROUTE_NAMES.SETTINGS,
    screen: (props: StargazerRouteProps) => (
      <SettingsScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
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
    name: "Contact Screen",
    screenName: ROUTE_NAMES.CONTACT,
    screen: (props: StargazerRouteProps) => (
      <ContactScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
  },
];

/** ========================================================================
 * Export
 * =========================================================================
 */

export default stargazerConfig;
