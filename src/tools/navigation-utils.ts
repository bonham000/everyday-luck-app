import { NavigationActions, StackActions } from "react-navigation";
import { DrawerLockMode } from "react-navigation-drawer";

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
  const drawerLockMode = navigation.state.index > 0 ? LOCKED : UNLOCKED;
  return drawerLockMode;
};

/**
 * Helper to determine if the user is on a given screen.
 *
 * @param navigationState
 * @returns true if user is on the provided screen
 */
export const isOnGivenScreen = (
  navigationState: any,
  routeName: ROUTE_NAMES,
): boolean => {
  try {
    if (navigationState.routes[0].routeName === routeName) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
