# react-docgen-typescript-webpack-plugin

Webpack plugin to generate docgen information from Typescript React components.

## Installation

Add the package as a development dependency.

```shell
$ npm install --save-dev react-docgen-typescript-webpack-plugin

or

$ yarn add --dev react-docgen-typescript-webpack-plugin
```

Add the plugin to your Webpack configuration.

```javascript
const path = require("path");
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");
const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");

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
```

## Usage

### Storybook Info Plugin

Include the `withInfo` decorator as normal.

**Special Note:**

The Storybook Info addon will only attempt to read Docgen information when the
story name matches the name of the component. So if you have a component named
`ColorButton`, then you will have to use something like:

`storiesOf("...", module).add("ColorButton", ...)`

---

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

This plugin is mostly a hack job at the moment. It is a work in progress so it
is most likely not suitable for production. Pull requests are most welcome.

## Limitations

This plugin makes use of the great project:
https://github.com/styleguidist/react-docgen-typescript

It is subject to the same limitations. Component docgen information can not be
generated for components who are only exported as default. You can work around
the issue by exporting the component using a named export.

**CURRENT LIMITATION**
The current implementation seems to have trouble with the compiler option `module` being set to `esnext`.

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
