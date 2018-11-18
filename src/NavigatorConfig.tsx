import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProp,
} from "react-navigation";

import CreateNote from "./CreateNoteScreen";
import DrawerComponent from "./DrawerMenuScreen";
import App from "./NotesHomeScreen";
import { ROUTE_NAMES } from "./RouteNames";
import ViewNote from "./ViewNoteScreen";

const AppStack = (userName: string) => {
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
            title: `${userName}’s Notes 📚`,
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
      [ROUTE_NAMES.CREATE_NOTE]: {
        screen: CreateNote,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          const title = navigation.getParam("title", "");
          const content = navigation.getParam("content", "");
          const editingNote = !!title && !!content;
          return {
            title: `${editingNote ? "Edit" : "Create a"} Note 📝`,
            headerBackTitle: null,
          };
        },
      },
      [ROUTE_NAMES.VIEW_NOTE]: {
        screen: ViewNote,
        navigationOptions: ({
          navigation,
        }: {
          navigation: NavigationScreenProp<{}>;
        }) => {
          const title = navigation.getParam("title", "");
          return {
            title: `${title} 🎨`,
            headerBackTitle: null,
          };
        },
      },
    },
    {
      initialRouteName: ROUTE_NAMES.HOME,
    },
  );
};

export default (userName: string) =>
  createDrawerNavigator(
    {
      [ROUTE_NAMES.HOME]: {
        screen: AppStack(userName),
      },
    },
    {
      contentComponent: DrawerComponent,
    },
  );
