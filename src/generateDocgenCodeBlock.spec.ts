import * as vm from "vm";
import { ComponentDoc } from "react-docgen-typescript/lib/parser.js";
import singlePropComponentDoc from "./__fixtures__/component-docs/singleProp";
import multiPropComponentDoc from "./__fixtures__/component-docs/multipleProps";
import hyphenatedPropNameComponentDoc from "./__fixtures__/component-docs/hyphenatedPropName";
import multilineDescriptionComponentDoc from "./__fixtures__/component-docs/multilineDescription";
import generateDocgenCodeBlock from "./generateDocgenCodeBlock";

it("renders normal single prop", () => {
  const sandbox = executeGeneratedCode(singlePropComponentDoc);

  expect(sandbox).toMatchSnapshot();
});

// Ensure comma is being added in prop list.
it("renders multiple props", () => {
  const sandbox = executeGeneratedCode(multiPropComponentDoc);

  expect(sandbox).toMatchSnapshot();
});

// Ensure prop names with special characters are being handled.
it("renders prop with hyphen", () => {
  const sandbox = executeGeneratedCode(hyphenatedPropNameComponentDoc);

  expect(sandbox).toMatchSnapshot();
});

// Ensure new lines are escaped in description text
it("escapes newlines in description text", () => {
  const sandbox = executeGeneratedCode(multilineDescriptionComponentDoc);

  expect(sandbox).toMatchSnapshot();
});

function executeGeneratedCode(componentDoc: ComponentDoc) {
  const sandbox = {
    STORYBOOK_REACT_CLASSES: {},
  };
  vm.createContext(sandbox);

  const componentStub = `
    const exports = {};

    exports.Component = {};
  `;

  const generatedCode = generateDocgenCodeBlock(
    componentDoc,
    "./Component.tsx",
    "STORYBOOK_REACT_CLASSES",
  );

  vm.runInContext(componentStub + "\n" + generatedCode, sandbox);
  return sandbox;
}
