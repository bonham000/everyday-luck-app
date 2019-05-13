import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { NavigationState } from "react-native-paper";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import { LessonScreenParams } from "@src/api/types";
import MultipleChoiceComponent from "@src/components/MultipleChoiceComponent";
import QuizInput from "@src/components/QuizInputComponent";
import { ROUTE_NAMES } from "@src/constants/Routes";
import AboutScreen from "@src/screens/AboutScreen";
import DrawerComponent from "@src/screens/DrawerMenuScreen";
import FlashcardsScreen from "@src/screens/FlashcardsScreen";
import GoogleSignInScreen from "@src/screens/GoogleSigninScreen";
import HomeScreen from "@src/screens/HomeScreen";
import LessonSummaryScreen from "@src/screens/LessonSummaryScreen";
import QuizScreen from "@src/screens/QuizScreen";
import ViewAllScreen from "@src/screens/ViewAllScreen";
import { getDrawerLockedState } from "@src/tools/utils";

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
          title: "English Recognition 🗽",
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
          title: "Mandarin Recognition 🇨🇳",
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
      contentComponent: DrawerComponent,
    },
  );
};
