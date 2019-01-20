import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/Routes";
import { LessonScreenParams } from "@src/content/types";
import AboutScreen from "@src/screens/AboutScreen";
import DrawerComponent from "@src/screens/DrawerMenuScreen";
import FlashcardsScreen from "@src/screens/FlashcardsScreen";
import HomeScreen from "@src/screens/HomeScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import MandarinQuizScreen from "@src/screens/QuizScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";

/** ========================================================================
 * App navigation
 * =========================================================================
 */
const AppStack = () => {
  return createStackNavigator(
    {
      [ROUTE_NAMES.HOME]: {
        screen: HomeScreen,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          return {
            title: "Home 🏮",
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
          navigation: NavigationScreenProp<LessonScreenParams>;
        }) => {
          const index = navigation.getParam("lessonIndex");
          const isSummaryReview = navigation.getParam("isSummaryReview");
          return {
            title: isSummaryReview
              ? "Review All 🔮"
              : `Lesson ${Number(index) + 1} Summary 🎎`,
            headerBackTitle: null,
          };
        },
      },
      [ROUTE_NAMES.QUIZ]: {
        screen: MandarinQuizScreen,
        navigationOptions: {
          title: "Quiz 🇨🇳",
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
      [ROUTE_NAMES.ABOUT]: {
        screen: AboutScreen,
        navigationOptions: {
          title: "About 🎏",
          headerBackTitle: null,
        },
      },
    },
    {
      initialRouteName: ROUTE_NAMES.HOME,
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

export default () => {
  return createDrawerNavigator(
    {
      [ROUTE_NAMES.HOME]: {
        screen: AppStack(),
      },
    },
    // @ts-ignore
    {
      contentComponent: DrawerComponent,
    },
  );
};
