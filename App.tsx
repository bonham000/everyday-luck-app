import React from "react";
import { Provider as ReactNativePaperProvider } from "react-native-paper";
import Stargazer from "react-native-stargazer";

import { APP_THEME } from "@src/constants/Theme";
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
      <ReactNativePaperProvider theme={APP_THEME}>
        <Stargazer
          appRouteConfig={ROUTES}
          routeConfig={stargazerRoutes}
          stargazerServerUrl={CONFIG.STARGAZER_SERVER_URL}
        />
      </ReactNativePaperProvider>
    );
  }
}
