const path = require("path");

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),

      // require.resolve("react-docgen-typescript-loader"),
      require.resolve("../../.."),
    ],
  });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
