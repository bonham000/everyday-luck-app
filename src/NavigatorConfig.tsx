import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import AboutScreen from "./AboutScreen";
import DrawerComponent from "./DrawerMenuScreen";
import FlashcardsScreen from "./FlashcardsScreen";
import MandarinQuizScreen from "./MandarinQuizScreen";
import { ROUTE_NAMES } from "./RouteNames";
import ViewAllScreen from "./ViewAllScreen";

const AppStack = () => {
  return createStackNavigator(
    {
      [ROUTE_NAMES.MANDARIN_QUIZ]: {
        screen: MandarinQuizScreen,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          return {
            title: "Learn Mandarin 🇨🇳",
            headerBackTitle: null,
            headerLeft: <MenuIcon onPress={navigation.toggleDrawer} />,
          };
        },
      },
      [ROUTE_NAMES.FLASHCARDS]: {
        screen: FlashcardsScreen,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          return {
            title: "Mandarin Flashcards 🗂",
            headerBackTitle: null,
            headerLeft: <MenuIcon onPress={navigation.toggleDrawer} />,
          };
        },
      },
      [ROUTE_NAMES.VIEW_ALL]: {
        screen: ViewAllScreen,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          return {
            title: "All Words ⛩",
            headerBackTitle: null,
            headerLeft: <MenuIcon onPress={navigation.toggleDrawer} />,
          };
        },
      },
      [ROUTE_NAMES.ABOUT]: {
        screen: AboutScreen,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          return {
            title: "About 🎏",
            headerBackTitle: null,
            headerLeft: <MenuIcon onPress={navigation.toggleDrawer} />,
          };
        },
      },
    },
    {
      initialRouteName: ROUTE_NAMES.MANDARIN_QUIZ,
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

export default () =>
  createDrawerNavigator(
    {
      [ROUTE_NAMES.MANDARIN_QUIZ]: {
        screen: AppStack(),
      },
    },
    {
      contentComponent: DrawerComponent,
    },
  );
