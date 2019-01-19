module.exports = {
  preset: "jest-expo",
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  transform: {
    "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  testPathIgnorePatterns: [
    "<rootDir>/src/",
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|react-clone-referenced-element|expo(nent)?|@expo(nent)?/.*|react-navigation|native-base|native-base-shoutem-theme|sentry-expo|style-primitives))",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "android.ts",
    "android.tsx",
  ],
};
