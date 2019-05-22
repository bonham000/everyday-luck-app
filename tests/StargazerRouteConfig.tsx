import { NavigationScreenRouteConfig } from "react-navigation";

import { ROUTES } from "@src/NavigatorConfig";

/** ========================================================================
 * Stargazer Route Config
 * =========================================================================
 */

const getStargazerRouteConfig = (routeConfig: NavigationScreenRouteConfig) => {
  const stargazerConfig = Object.entries(routeConfig).map(
    ([screenName, config]: any) => {
      return {
        screenName,
        name: screenName,
        screen: config.screen,
      };
    },
  );

  return stargazerConfig;
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default getStargazerRouteConfig(ROUTES);
