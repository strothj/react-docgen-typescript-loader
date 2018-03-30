const path = require("path");

/**
 * To extend the default Storybook 3 config, it is necessary to import it from
 * the @storybook/react package. Storybook 4 provides the default config as the
 * third parameter to this module's exported function.
 */
// const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env, config /* Storybook 4 default config */) => {
  // Storybook 3 default config
  // const config = genDefaultConfig(baseConfig);

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
