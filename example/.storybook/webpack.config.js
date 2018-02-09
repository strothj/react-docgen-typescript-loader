const path = require("path");
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");
const TSDocgenPlugin = require("../../dist");

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig);

  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    loader: require.resolve("ts-loader"),
  });

  config.plugins.push(new TSDocgenPlugin());

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
