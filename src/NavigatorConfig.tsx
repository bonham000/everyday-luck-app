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
import AboutScreen from "@src/screens/AboutScreen";
import ContactScreen from "@src/screens/ContactScreen";
import FlashcardsScreen from "@src/screens/FlashcardsScreen";
import GoogleSignInScreen from "@src/screens/GoogleSigninScreen";
import HomeScreen from "@src/screens/HomeScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import ListSummaryScreen from "@src/screens/ListSummaryScreen";
import QuizScreen from "@src/screens/QuizScreen";
import SettingsScreen from "@src/screens/SettingsScreen";
import TranslationScreen from "@src/screens/TranslationScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";
import { LessonScreenParams, ListScreenParams } from "@src/tools/types";
import { getDrawerLockedState } from "@src/tools/utils";

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
            : "Daily Quiz! 🏖",
        headerBackTitle: null,
      };
    },
  },
  [ROUTE_NAMES.LIST_SUMMARY]: {
    screen: ListSummaryScreen,
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
      <QuizScreen {...props} quizType={QUIZ_TYPE.QUIZ_TEXT} />
    ),
    navigationOptions: {
      title: "Characters Quiz 🇨🇳",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreen {...props} quizType={QUIZ_TYPE.MANDARIN} />
    ),
    navigationOptions: {
      title: "Mandarin Recognition 🇨🇳",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreen {...props} quizType={QUIZ_TYPE.ENGLISH} />
    ),
    navigationOptions: {
      title: "English Recognition 🗽",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.MULTIPLE_CHOICE_VOICE]: {
    screen: (props: NavigationScreenProp<{}>) => (
      <QuizScreen {...props} quizType={QUIZ_TYPE.PRONUNCIATION} />
    ),
    navigationOptions: {
      title: "Mandarin Pronunciation 🗣",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.FLASHCARDS]: {
    screen: FlashcardsScreen,
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
    screen: TranslationScreen,
    navigationOptions: {
      title: "Translation 📔",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.SETTINGS]: {
    screen: SettingsScreen,
    navigationOptions: {
      title: "Settings 🏗",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.ABOUT]: {
    screen: AboutScreen,
    navigationOptions: {
      title: "About 🏹",
      headerBackTitle: null,
    },
  },
  [ROUTE_NAMES.CONTACT]: {
    screen: ContactScreen,
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
