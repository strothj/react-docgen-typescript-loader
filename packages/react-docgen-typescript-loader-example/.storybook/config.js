import React from "react";
import { addDecorator, configure } from "@storybook/react";

addDecorator(story => (
  <React.Fragment>
    <style dangerouslySetInnerHTML={{__html: `
      html {
        box-sizing: border-box;
      }

      *, *:before, *:after {
        box-sizing: inherit;
      }
    `}}/>
    {story()}
  </React.Fragment>
))

// automatically import all files ending in *.stories.js
const req = require.context("../src/components", true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
