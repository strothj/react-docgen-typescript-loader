import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
// import ColorButton from "./ColorButton";
import { ColorButton } from "./ColorButton";

storiesOf("Components", module).add(
  "ColorButton",
  withInfo({ inline: true })(() => (
    <ColorButton color="blue">Color Button</ColorButton>
  )),
);
