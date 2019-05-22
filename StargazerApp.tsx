import React from "react";
import Stargazer from "react-native-stargazer";

import { ROUTES } from "@src/NavigatorConfig";
import CONFIG from "@src/tools/config";
import stargazerRoutes from "./tests/StargazerRouteConfig";

/** ========================================================================
 * Stargazer App
 * =========================================================================
 */

export default class extends React.Component {
  render(): JSX.Element {
    return (
      <Stargazer
        appRouteConfig={ROUTES}
        routeConfig={stargazerRoutes}
        stargazerServerUrl={CONFIG.STARGAZER_SERVER_URL}
      />
    );
  }
}
