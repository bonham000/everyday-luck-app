import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import MultipleChoiceComponent from "@src/components/MultipleChoiceComponent";
import QuizInput from "@src/components/QuizInputComponent";
import { ROUTE_NAMES } from "@src/constants/Routes";
import { LessonScreenParams } from "@src/content/types";
import AboutScreen from "@src/screens/AboutScreen";
import DrawerComponent from "@src/screens/DrawerMenuScreen";
import FlashcardsScreen from "@src/screens/FlashcardsScreen";
import HomeScreen from "@src/screens/HomeScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import QuizScreen from "@src/screens/QuizScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";
import { NavigationState } from "react-native-paper";

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
      [ROUTE_NAMES.QUIZ]: {
        screen: (props: any) => (
          <QuizScreen {...props} quizTypes="q" Component={QuizInput} />
        ),
        navigationOptions: {
          title: "Quiz 🇨🇳",
          headerBackTitle: null,
        },
      },
      [ROUTE_NAMES.MULTIPLE_CHOICE]: {
        screen: (props: any) => (
          <QuizScreen
            {...props}
            quizType="mc"
            Component={MultipleChoiceComponent}
          />
        ),
        navigationOptions: {
          title: "Multiple Choice 🇨🇳",
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
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<NavigationState<{}>>;
        }) => {
          return {
            drawerLockMode:
              navigation.state.index > 0 ? "locked-closed" : "unlocked",
          };
        },
      },
    },
    // @ts-ignore
    {
      contentComponent: DrawerComponent,
    },
  );
};
