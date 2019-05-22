jest.mock("react-native/Libraries/Components/ScrollView/ScrollView", () =>
  jest.requireActual(
    "react-native/Libraries/Components/ScrollView/__mocks__/ScrollViewMock",
  ),
);
