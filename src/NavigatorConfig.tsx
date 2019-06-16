import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { NavigationState } from "react-native-paper";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
  NavigationScreenRouteConfig,
} from "react-navigation";

import SideMenuComponent from "@src/components/SideMenuComponent";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { QUIZ_TYPE } from "@src/providers/GlobalStateContext";
import AboutScreenComponent from "@src/screens/AboutScreen";
import AccountScreenComponent from "@src/screens/AccountScreen";
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

/** ========================================================================
 * App Routes
 * =========================================================================
 */

const ROUTES: NavigationScreenRouteConfig = {
  [ROUTE_NAMES.HOME]: {
    screen: HomeScreen,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<{}>;
    }) => {
      return {
        title: "天天吉 🍀",
        headerBackTitle: null,
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
      const listIndex = navigation.getParam("listIndex") + 1;
      return {
        title:
          type === "LESSON"
            ? `HSK List ${listIndex} - Quiz ${Number(index) + 1} 🗂`
            : type === "SUMMARY"
            ? "Review All 🔮"
            : type === "DAILY_QUIZ"
            ? "Daily Quiz!"
            : `HSK List ${listIndex} Challenge`,
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
      return {
        title: `HSK Level ${listKey}`,
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
      title: "English Recognition 🇺🇸",
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
  [ROUTE_NAMES.VIEW_ALL]: {
    screen: ViewAllScreen,
    navigationOptions: {
      title: "Review All Words 📕",
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
  [ROUTE_NAMES.ABOUT]: {
    screen: AboutScreenComponent,
    navigationOptions: {
      title: "About 天天吉 🍀",
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
      title: "Intro Primer 🗺",
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

const createAppNavigationStack = (firstTimeUser: boolean) => {
  return createStackNavigator(ROUTES, {
    initialRouteName: firstTimeUser ? ROUTE_NAMES.WELCOME : ROUTE_NAMES.HOME,
  });
};

const MenuIcon = ({ onPress }: { onPress: () => void }) => (
  <MaterialIcons
    name="menu"
    size={32}
    style={{
      marginLeft: 15,
    }}
    onPress={onPress}
  />
);

const createNavigatorConfig = (firstTimeUser: boolean) => {
  return createDrawerNavigator(
    {
      [ROUTE_NAMES.APP]: {
        screen: createAppNavigationStack(firstTimeUser),
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<NavigationState<{}>>;
        }) => {
          return {
            drawerLockMode: getDrawerLockedState(navigation),
          };
        },
      },
    },
    // @ts-ignore
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
