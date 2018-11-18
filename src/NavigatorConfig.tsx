import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import DrawerComponent from "./DrawerMenuScreen";
import App from "./HomeScreen";
import { ROUTE_NAMES } from "./RouteNames";

const AppStack = () => {
  return createStackNavigator(
    {
      [ROUTE_NAMES.HOME]: {
        screen: App,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          return {
            title: "Learn Mandarin",
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
      initialRouteName: ROUTE_NAMES.HOME,
    },
  );
};

export default () =>
  createDrawerNavigator(
    {
      [ROUTE_NAMES.HOME]: {
        screen: AppStack(),
      },
    },
    {
      contentComponent: DrawerComponent,
    },
  );
