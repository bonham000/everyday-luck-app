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
  setupFiles: ["<rootDir>/tests/setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/src/",
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|react-clone-referenced-element|expo(nent)?|@expo(nent)?/.*|@unimodules|react-navigation|glamorous-native))",
  ],
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
