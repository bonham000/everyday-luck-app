import fs from "fs";
import path from "path";

const APP = "../App.tsx";
const AppEntryPoint = fs.readFileSync(path.join(__dirname, APP), "utf8");

describe("Stargazer settings are disabled", () => {
  test("Test that the App.tsx file still renders the main app.", () => {
    expect(AppEntryPoint).toMatchSnapshot();
  });
});
