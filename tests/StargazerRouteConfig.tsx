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
    screenName: ROUTE_NAMES.SIGNIN,
    name: "Google Sign In",
    screen: (props: StargazerRouteProps) => (
      <GoogleSigninScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
  },
  {
    screenName: ROUTE_NAMES.HOME,
    name: "Home Screen",
    screen: (props: StargazerRouteProps) => (
      <HomeScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    screenName: ROUTE_NAMES.LESSON_SUMMARY,
    name: "Lesson Summary Screen",
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
    screenName: ROUTE_NAMES.LIST_SUMMARY,
    name: "List Summary Screen",
    screen: (props: StargazerRouteProps<ListScreenParams>) => (
      <ListSummaryScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    screenName: ROUTE_NAMES.QUIZ,
    name: "",
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
    screenName: ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN,
    name: "",
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.MANDARIN}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    screenName: ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH,
    name: "",
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.ENGLISH}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    screenName: ROUTE_NAMES.MULTIPLE_CHOICE_VOICE,
    name: "",
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <QuizScreenComponent
        navigation={props.navigation}
        quizType={QUIZ_TYPE.PRONUNCIATION}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    screenName: ROUTE_NAMES.FLASHCARDS,
    name: "Flashcards Screen",
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <FlashcardsScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
    paramsForNextScreen: MockLessonScreenParams,
  },
  {
    screenName: ROUTE_NAMES.VIEW_ALL,
    name: "View All Screen",
    screen: (props: StargazerRouteProps<LessonScreenParams>) => (
      <ViewAllScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
        {...MockSoundRecordingProps}
      />
    ),
  },
  {
    screenName: ROUTE_NAMES.TRANSLATION,
    name: "Translation Screen",
    screen: (props: StargazerRouteProps) => (
      <TranslationScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
  },
  {
    screenName: ROUTE_NAMES.SETTINGS,
    name: "Settings Screen",
    screen: (props: StargazerRouteProps) => (
      <SettingsScreenComponent
        navigation={props.navigation}
        {...MockGlobalStateProps}
      />
    ),
  },
  {
    screenName: ROUTE_NAMES.ABOUT,
    name: "About Screen",
    screen: (props: StargazerRouteProps) => (
      <AboutScreenComponent navigation={props.navigation} />
    ),
  },
  {
    screenName: ROUTE_NAMES.CONTACT,
    name: "Contact Screen",
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
