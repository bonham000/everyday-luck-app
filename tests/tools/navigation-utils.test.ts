import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { resetNavigation } from "@src/tools/navigation-utils";

describe("navigation-utils", () => {
  test("resetNavigation", () => {
    const result = resetNavigation(ROUTE_NAMES.HOME);
    expect(result).toMatchSnapshot();
  });

  test.skip("getDrawerLockedState", () => {
    /**
     * TODO: Add test.
     */
    expect(true).toBeTruthy();
  });
});
