import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { NavigationState } from "react-native-paper";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import MultipleChoiceComponent from "@src/components/MultipleChoiceComponent";
import QuizInput from "@src/components/QuizInputComponent";
import SideMenuComponent from "@src/components/SideMenuComponent";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import AboutScreen from "@src/screens/AboutScreen";
import FlashcardsScreen from "@src/screens/FlashcardsScreen";
import GoogleSignInScreen from "@src/screens/GoogleSigninScreen";
import HomeScreen from "@src/screens/HomeScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import QuizScreen from "@src/screens/QuizScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";
import { LessonScreenParams } from "@src/tools/types";
import { getDrawerLockedState } from "@src/tools/utils";
import ListSummaryScreen from "./screens/ListSummaryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import TranslationScreen from "./screens/TranslationScreen";

/** ========================================================================
 * App navigation
 * =========================================================================
 */
const createAppNavigationStack = (userLoggedIn: boolean) => {
  return createStackNavigator(
    {
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
            title: "Lessons Home 🏮",
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
          return {
            title:
              type === "LESSON"
                ? `Lesson ${Number(index) + 1} Summary 🎎`
                : type === "SUMMARY"
                ? "Review All 🔮"
                : "Game Mode! 🎲",
            headerBackTitle: null,
          };
        },
      },
      [ROUTE_NAMES.LIST_SUMMARY]: {
        screen: ListSummaryScreen,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}, LessonScreenParams>;
        }) => {
          // const index = navigation.getParam("lessonIndex");
          // const type = navigation.getParam("type");
          return {
            title: "Lesson Summary",
            headerBackTitle: null,
          };
        },
      },
      [ROUTE_NAMES.QUIZ]: {
        screen: (props: NavigationScreenProp<{}>) => (
          <QuizScreen {...props} quizType="quiz_text" Component={QuizInput} />
        ),
        navigationOptions: {
          title: "Quiz 🇨🇳",
          headerBackTitle: null,
        },
      },
      [ROUTE_NAMES.MULTIPLE_CHOICE_MANDARIN]: {
        screen: (props: NavigationScreenProp<{}>) => (
          <QuizScreen
            {...props}
            quizType="mc_mandarin"
            Component={(childProps: NavigationScreenProp<{}>) => (
              <MultipleChoiceComponent
                {...childProps}
                multipleChoiceType="MANDARIN"
              />
            )}
          />
        ),
        navigationOptions: {
          title: "Mandarin Recognition 🇨🇳",
          headerBackTitle: null,
        },
      },
      [ROUTE_NAMES.MULTIPLE_CHOICE_ENGLISH]: {
        screen: (props: NavigationScreenProp<{}>) => (
          <QuizScreen
            {...props}
            quizType="mc_english"
            Component={(childProps: NavigationScreenProp<{}>) => (
              <MultipleChoiceComponent
                {...childProps}
                multipleChoiceType="ENGLISH"
              />
            )}
          />
        ),
        navigationOptions: {
          title: "English Recognition 🗽",
          headerBackTitle: null,
        },
      },
      [ROUTE_NAMES.MULTIPLE_CHOICE_VOICE]: {
        screen: (props: NavigationScreenProp<{}>) => (
          <QuizScreen
            {...props}
            quizType="mandarin_pronunciation"
            Component={(childProps: NavigationScreenProp<{}>) => (
              <MultipleChoiceComponent
                {...childProps}
                multipleChoiceType="MANDARIN_PRONUNCIATION"
              />
            )}
          />
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
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          const title = navigation.getParam("headerTitle", undefined);
          return {
            title: title || "All Words ⛩",
            headerBackTitle: null,
          };
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
          title: "Settings ⚙",
          headerBackTitle: null,
        },
      },
      [ROUTE_NAMES.ABOUT]: {
        screen: AboutScreen,
        navigationOptions: {
          title: "About 🎏",
          headerBackTitle: null,
        },
      },
    },
    {
      initialRouteName: userLoggedIn ? ROUTE_NAMES.HOME : ROUTE_NAMES.SIGNIN,
    },
  );
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

export default (userLoggedIn: boolean) => {
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
