# react-docgen-typescript-loader

Webpack loader to generate docgen information from TypeScript React components. The primary use case is to get the prop types tables populated in the [Storybook Info Addon](https://github.com/storybooks/storybook/tree/master/addons/info).

![Example Image](/example.png?raw=true)

## Installation

### Requirements

Requires TypeScript 2.3 or above.

### Add the package as a development dependency.

```shell
$ npm install --save-dev react-docgen-typescript-loader

or

$ yarn add --dev react-docgen-typescript-loader
```

### Performance

There is quite a significant startup cost due to the initial type parsing. Once the project is running in watch mode then things should be smoother due to Webpack caching. You will probably want to exclude this loader in your production Webpack config to speed up building.

### Add the plugin to your Webpack configuration.

**IMPORTANT:** Webpack loaders are executed right-to-left (or bottom-to-top). `react-docgen-typescript-loader` needs to be added under `ts-loader`.

Example Storybook config `./storybook/webpack.config.js`.

```javascript
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

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
```

## Optional Loader Options

| Option               | Type                         | Description                                                                                                                                                                                                                                                                 |
| -------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| skipPropsWithName    | `string[] | string`          | Avoid including docgen information for the prop or props specified.                                                                                                                                                                                                         |
| skipPropsWithoutDoc  | `boolean`                    | Avoid including docgen information for props without documentation.                                                                                                                                                                                                         |
| tsconfigPath         | `string`                     | Specify the location of the tsconfig.json to use. Can not be used with compilerOptions.                                                                                                                                                                                     |
| compilerOptions      | `typescript.CompilerOptions` | Specify TypeScript compiler options. Can not be used with tsconfigPath.                                                                                                                                                                                                     |
| docgenCollectionName | `string | null`              | Specify the docgen collection name to use. All docgen information will be collected into this global object. Set to `null` to disable. Defaults to `STORYBOOK_REACT_CLASSES` for use with the Storybook Info Addon. https://github.com/gongreg/react-storybook-addon-docgen |

## Usage

### Storybook Info Addon

Include the `withInfo` decorator as normal.

**Special Note:**

The Storybook Info Addon will only attempt to read Docgen information when the
story name matches the name of the component. So if you have a component named
`ColorButton`, then you will have to use something like:

`storiesOf("...", module).add("ColorButton", ...)`

---

`ColorButton.tsx`:

```javascript
import * as React from "react";

interface ColorButtonProps {
  /**
   * Buttons background color
   **/
  color: "blue" | "green";

  /**
   * Font size in rem.
   *
   * @default 2
   */
  fontSize?: number;
}

/** A button with a configurable background color. */
export const ColorButton: React.SFC<ColorButtonProps> = props => (
  <button
    style={{
      padding: 40,
      color: "#eee",
      backgroundColor: props.color,
      fontSize: `${props.fontSize || 2}rem`,
    }}
  >
    {props.children}
  </button>
);

export default ColorButton;
```

`ColorButton.stories.tsx`:

```javascript
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import ColorButton from "./ColorButton";

storiesOf("Components", module).add(
  "ColorButton",
  withInfo({ inline: true })(() => (
    <ColorButton color="blue">Color Button</ColorButton>
  )),
);
```

## Experimental

This loader is a work in progress. If you encounter issues, please open an issue with as much information as you can find so the cause can be identified.

## Limitations

This plugin makes use of the project:
https://github.com/styleguidist/react-docgen-typescript

It is subject to the same limitations. Component docgen information can not be
generated for components that are only exported as default. You can work around
the issue by exporting the component using a named export.

```javascript
import * as React from "react";

interface ColorButtonProps {
  /** Buttons background color */
  color: "blue" | "green";
}

/** A button with a configurable background color. */
export const ColorButton: React.SFC<ColorButtonProps> = props => (
  <button
    style={{
      padding: 40,
      color: "#eee",
      backgroundColor: props.color,
      fontSize: "2rem",
    }}
  >
    {props.children}
  </button>
);

export default ColorButton;
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Energy Drinks?

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NNRJYNNY5YTJ2)
