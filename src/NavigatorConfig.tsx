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
import ContactScreenComponent from "@src/screens/ContactScreen";
import FlashcardsScreenComponent from "@src/screens/FlashcardsScreen";
import GoogleSignInScreen from "@src/screens/GoogleSigninScreen";
import HomeScreen from "@src/screens/HomeScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import ListSummaryScreenComponent from "@src/screens/ListSummaryScreen";
import QuizScreenComponent from "@src/screens/QuizScreen";
import SettingsScreenComponent from "@src/screens/SettingsScreen";
import TranslationScreenComponent from "@src/screens/TranslationScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";
import { getDrawerLockedState } from "@src/tools/navigation-utils";
import { LessonScreenParams, ListScreenParams } from "@src/tools/types";

/** ========================================================================
 * App Routes
 * =========================================================================
 */

const ROUTES: NavigationScreenRouteConfig = {
  [ROUTE_NAMES.SIGNIN]: {
    screen: GoogleSignInScreen,
    navigationOptions: {
      title: "Welcome 歡迎",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.HOME]: {
    screen: HomeScreen,
    navigationOptions: ({
      navigation,
    }: {
      navigation: NavigationScreenProp<{}>;
    }) => {
      return {
        title: "App Home 🏰",
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
      const listIndex = navigation.getParam("listIndex");
      return {
        title:
          type === "LESSON"
            ? `HSK List ${listIndex + 1} - Quiz ${Number(index) + 1} 🔖`
            : type === "SUMMARY"
            ? "Review All 🔮"
            : type === "DAILY_QUIZ"
            ? "Daily Quiz! 🏖"
            : "HSL Level Challenge 🦊",
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
      title: "Characters Quiz 🇨🇳",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.DAILY_CHALLENGE]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreenComponent {...props} />
    ),
    navigationOptions: {
      title: "Daily Challenge ⛵",
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
  [ROUTE_NAMES.FLASHCARDS]: {
    screen: FlashcardsScreenComponent,
    navigationOptions: {
      title: "Flashcards 👨‍🚀",
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
      title: "Settings 🏗",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.ABOUT]: {
    screen: AboutScreenComponent,
    navigationOptions: {
      title: "About 🏹",
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

const createAppNavigationStack = (userLoggedIn: boolean) => {
  return createStackNavigator(ROUTES, {
    initialRouteName: userLoggedIn ? ROUTE_NAMES.HOME : ROUTE_NAMES.SIGNIN,
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

const createNavigatorConfig = (userLoggedIn: boolean) => {
  return createDrawerNavigator(
    {
      [ROUTE_NAMES.APP]: {
        screen: createAppNavigationStack(userLoggedIn),
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
