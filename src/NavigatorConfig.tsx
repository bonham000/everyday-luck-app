import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import DrawerComponent from "./DrawerMenuScreen";
import FlashcardsScreen from "./FlashcardsScreen";
import MandarinQuizScreen from "./MandarinQuizScreen";
import { ROUTE_NAMES } from "./RouteNames";

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
            headerLeft: (
              <MaterialIcons
                name="menu"
                size={32}
                style={{
                  marginLeft: 15,
                }}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
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
            headerLeft: (
              <MaterialIcons
                name="menu"
                size={32}
                style={{
                  marginLeft: 15,
                }}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          };
        },
      },
    },
    {
      initialRouteName: ROUTE_NAMES.MANDARIN_QUIZ,
    },
  );
};

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
