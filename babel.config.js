module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "inline-dotenv",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@src": "./src",
          },
        },
      ],
    ],
  };
};
