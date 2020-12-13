module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "inline-dotenv",
      "jest-hoist",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@src": "./src",
            "@tests": "./tests",
          },
        },
      ],
    ],
  };
};
