import { ROUTES } from "@src/NavigatorConfig";
import stargazerConfig from "./StargazerRouteConfig";

describe("Stargazer Config", () => {
  test("Config includes all defined app routes", () => {
    const stargazerRouteNameSet = stargazerConfig.reduce((names, config) => {
      names.add(config.screenName);
      return names;
    }, new Set());
    for (const route in ROUTES) {
      expect(stargazerRouteNameSet.has(route)).toBeTruthy();
    }
  });
});
