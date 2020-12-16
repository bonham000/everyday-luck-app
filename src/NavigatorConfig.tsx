import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  NavigationRouteConfigMap,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import SideMenuComponent from "@src/components/SideMenuComponent";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { QUIZ_TYPE } from "@src/providers/GlobalStateContext";
import AboutScreenComponent from "@src/screens/AboutScreen";
import AccountScreenComponent from "@src/screens/AccountScreen";
import CharacterWritingScreenComponent from "@src/screens/CharacterWritingScreen";
import ContactScreenComponent from "@src/screens/ContactScreen";
import FlashcardsScreenComponent from "@src/screens/FlashcardsScreen";
import HomeScreen from "@src/screens/HomeScreen";
import IntroScreenComponent from "@src/screens/IntroScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import ListSummaryScreenComponent from "@src/screens/ListSummaryScreen";
import QuizScreenComponent from "@src/screens/QuizScreen";
import SettingsScreenComponent from "@src/screens/SettingsScreen";
import TranslationScreenComponent from "@src/screens/TranslationScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";
import WelcomeScreenComponent from "@src/screens/WelcomeScreen";
import { getDrawerLockedState } from "@src/tools/navigation-utils";
import { LessonScreenParams, ListScreenParams } from "@src/tools/types";
import { Platform } from "react-native";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "./providers/GlobalStateProvider";
import AboutDetailScreenComponent from "./screens/AboutDetailScreen";
import AddWordScreenComponent from "./screens/AddWordScreen";
import AudioReviewAllScreen from "./screens/AudioReviewAllScreen";
import NotePadScreen from "./screens/NotePadScreen";
// import RadicalsScreenComponent from "./screens/RadicalsScreen";
import WritingPadScreenComponent from "./screens/WritingPadScreen";

/** ========================================================================
 * App Routes
 * =========================================================================
 */

const ROUTES: NavigationRouteConfigMap<any, any> = {
  [ROUTE_NAMES.HOME]: {
    screen: HomeScreen,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<{}>;
    }) => {
      return {
        title: "🍊 天天吉 🍀",
        headerBackTitle: null,
        // @ts-ignore
        headerLeft: <MenuIcon onPress={navigation.toggleDrawer} />,
      };
    },
  },
  [ROUTE_NAMES.LESSON_SUMMARY]: {
    screen: LessonSummaryScreen,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<{}, LessonScreenParams>;
    }) => {
      const index = navigation.getParam("lessonIndex");
      const type = navigation.getParam("type");
      const listTitle = navigation.getParam("listTitle");
      const listIndex = navigation.getParam("listIndex") + 1;

      const quizTitle = `Quiz ${Number(index) + 1}`;
      const IS_HSK = listIndex > 4;
      const lessonTitle = IS_HSK
        ? `${quizTitle} - ${listTitle}`
        : `HSK List ${listIndex} - ${quizTitle} 🗂`;
      const hskListTitle = IS_HSK
        ? `HSK List ${listIndex} Challenge`
        : listTitle;

      return {
        title:
          type === "LESSON"
            ? lessonTitle
            : type === "SUMMARY"
            ? "Review All 🔮"
            : type === "DAILY_QUIZ"
            ? "Daily Quiz!"
            : type === "SHUFFLE_QUIZ"
            ? "Shuffle Quiz"
            : hskListTitle,
        headerBackTitle: null,
      };
    },
  },
  [ROUTE_NAMES.LIST_SUMMARY]: {
    screen: ListSummaryScreenComponent,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<{}, ListScreenParams>;
    }) => {
      const listKey = navigation.getParam("listKey");
      const listTitle = navigation.getParam("listTitle");
      return {
        title: listTitle ? listTitle : `HSK Level ${listKey}`,
        headerBackTitle: null,
      };
    },
  },
  [ROUTE_NAMES.QUIZ]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} quizType={QUIZ_TYPE.QUIZ_TEXT} />
    ),
    navigationOptions: {
      title: "Characters Quiz 中文",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} quizType={QUIZ_TYPE.MANDARIN} />
    ),
    navigationOptions: {
      title: "Mandarin Recognition 🇨🇳",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} quizType={QUIZ_TYPE.ENGLISH} />
    ),
    navigationOptions: {
      title: "English Recognition 🗽",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.MULTIPLE_CHOICE_VOICE]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} quizType={QUIZ_TYPE.PRONUNCIATION} />
    ),
    navigationOptions: {
      title: "Mandarin Pronunciation 🗣",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.DAILY_CHALLENGE]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} />
    ),
    navigationOptions: {
      title: "天天桔 🍊",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.HSK_TEST_OUT]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} />
    ),
    navigationOptions: {
      title: "HSK Challenge 💥",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.FLASHCARDS]: {
    screen: FlashcardsScreenComponent,
    navigationOptions: {
      title: "Flashcards 🗂",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.CHARACTER_WRITING]: {
    screen: CharacterWritingScreenComponent,
    navigationOptions: {
      title: "Writing Characters 🎨",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.WRITING_PAD]: {
    screen: WritingPadScreenComponent,
    navigationOptions: {
      title: "Practice Writing 🎨",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.VIEW_ALL]: {
    screen: ViewAllScreen,
    navigationOptions: {
      title: "Review All Words 📕",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.AUDIO_REVIEW_QUIZ]: {
    screen: AudioReviewAllScreen,
    navigationOptions: {
      title: "Audio Review 🗣",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.TRANSLATION]: {
    screen: TranslationScreenComponent,
    navigationOptions: {
      title: "Translation 📔",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.ADD_WORDS]: {
    screen: AddWordScreenComponent,
    navigationOptions: {
      title: "Custom Word List 📋",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.NOTE_PAD]: {
    screen: NotePadScreen,
    navigationOptions: {
      title: "Note Pad 🗂",
      headerBackTitle: null,
    },
  },
  // [ROUTE_NAMES.RADICALS]: {
  //   screen: RadicalsScreenComponent,
  //   navigationOptions: {
  //     title: "Radicals 🍰",
  //     headerBackTitle: null,
  //   },
  // },
  [ROUTE_NAMES.SETTINGS]: {
    screen: SettingsScreenComponent,
    navigationOptions: {
      title: "Settings 🔖",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.ACCOUNT]: {
    screen: AccountScreenComponent,
    navigationOptions: {
      title: "Account 🗃",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.WELCOME]: {
    screen: WelcomeScreenComponent,
    navigationOptions: {
      title: "Welcome - 大家好！",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.INTRO]: {
    screen: IntroScreenComponent,
    navigationOptions: {
      title: "About Chinese 中文",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.ABOUT]: {
    screen: AboutScreenComponent,
    navigationOptions: {
      title: "About the App 天天吉 🍀",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.ABOUT_DETAIL]: {
    screen: AboutDetailScreenComponent,
    navigationOptions: {
      title: "Using 天天吉",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.CONTACT]: {
    screen: ContactScreenComponent,
    navigationOptions: {
      title: "Contact 👨‍💻",
      headerBackTitle: null,
    },
  },
};

const styledNavigationOptions = {
  headerStyle: {
    height: 62,
  },
  headerForceInset: { top: "never", bottom: "never" },
};

const defaultNavigationOptions =
  Platform.OS === "android" ? styledNavigationOptions : {};

const createAppNavigationStack = (firstTimeUser: boolean) => {
  return createStackNavigator(ROUTES, {
    initialRouteName: firstTimeUser ? ROUTE_NAMES.WELCOME : ROUTE_NAMES.HOME,
    defaultNavigationOptions,
  });
};

const Hamburger = (
  props: { onPress: () => void } & GlobalStateContextProps,
) => (
  <MaterialIcons
    name="menu"
    size={32}
    color={props.appTheme === "dark" ? "white" : "black"}
    style={{
      marginLeft: 15,
    }}
    onPress={props.onPress}
  />
);

const MenuIcon = withGlobalStateContext(Hamburger);

const createNavigatorConfig = (firstTimeUser: boolean) => {
  return createDrawerNavigator(
    {
      [ROUTE_NAMES.APP]: {
        screen: createAppNavigationStack(firstTimeUser),
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<NavigationState>;
        }) => {
          return {
            drawerLockMode: getDrawerLockedState(navigation),
          };
        },
      },
    },
    {
      contentComponent: SideMenuComponent,
    },
  );
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default createNavigatorConfig;

export { ROUTES };
