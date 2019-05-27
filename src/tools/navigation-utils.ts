import {
  DrawerLockMode,
  NavigationActions,
  StackActions,
} from "react-navigation";

import { ROUTE_NAMES } from "@src/constants/RouteNames";

/**
 * Reset the navigation stack to the given route name.
 *
 * @param routeName to reset navigation to
 * @returns navigation reset action
 */
export const resetNavigation = (routeName: ROUTE_NAMES) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
};

const LOCKED = "locked-closed";
const UNLOCKED = "unlocked";

/**
 * Helper to get the locked state for the side menu drawer.
 *
 * @param navigation
 * @returns docker lock state
 */
export const getDrawerLockedState = (navigation: any): DrawerLockMode => {
  const isOnSignIn = isOnSignInScreen(navigation.state);
  const drawerLockMode = isOnSignIn
    ? LOCKED
    : navigation.state.index > 0
    ? LOCKED
    : UNLOCKED;
  return drawerLockMode;
};

/**
 * Helper to determine if the user is on the SignIn screen.
 *
 * @param navigationState
 * @returns true if user is on the SignIn screen.
 */
const isOnSignInScreen = (navigationState: any): boolean => {
  try {
    if (navigationState.routes[0].routeName === ROUTE_NAMES.SIGNIN) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
