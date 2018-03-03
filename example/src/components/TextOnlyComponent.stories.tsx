import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import TextOnlyComponent from "./TextOnlyComponent";

const stories = storiesOf("TextOnlyComponent", module);

stories.add(
  "with info addon",
  withInfo({ inline: true })(() => <TextOnlyComponent />),
);

stories.add("without info addon", () => <TextOnlyComponent />);
