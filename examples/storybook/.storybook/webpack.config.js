const path = require("path");

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),
      {
        // loader: require.resolve("react-docgen-typescript-loader"),
        loader: require.resolve("../../.."),
        options: {
          // Provide the path to your tsconfig.json so that your stories can
          // display types from outside each individual story.
          tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
        },
      },
    ],
  });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
