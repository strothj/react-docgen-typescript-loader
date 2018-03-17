const path = require("path");
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig);

  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),
      require.resolve("react-docgen-typescript-loader"),
    ],
  });

  // Just enabling CSS modules here
  config.module.rules = config.module.rules
    .filter(r => r.test.toString() !== "/\\.css$/")
    .concat({
      test: /\.css$/,
      use: [
        {
          loader: require.resolve("style-loader"),
        },
        {
          loader: require.resolve("css-loader"),
          options: {
            modules: true,
          },
        },
      ],
    });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
