import fs from "fs";
import path from "path";
import { parse, ParserOptions } from "react-docgen-typescript/lib/parser.js";
import generateDocgenCodeBlock, {
  GeneratorOptions,
} from "./generateDocgenCodeBlock";

const fixtureTests: GeneratorOptions[] = loadFixtureTests();
const simpleFixture = fixtureTests.find(f => f.filename === "Simple.tsx")!;

describe("component fixture", () => {
  fixtureTests.forEach(generatorOptions => {
    it(`${generatorOptions.filename} has code block generated`, () => {
      expect(generateDocgenCodeBlock(generatorOptions)).toMatchSnapshot();
    });
  });
});

it("adds component to docgen collection", () => {
  expect(
    generateDocgenCodeBlock({
      ...simpleFixture,
      docgenCollectionName: "STORYBOOK_REACT_CLASSES",
    }),
  ).toMatchSnapshot();
});

function getGeneratorOptions(parserOptions: ParserOptions = {}) {
  return (filename: string) => {
    const filePath = path.resolve(
      __dirname,
      "__fixtures__/components",
      filename,
    );

    return {
      filename,
      source: fs.readFileSync(filePath, "utf8"),
      componentDocs: parse(filePath, parserOptions),
      docgenCollectionName: null,
      setDisplayName: true,
      typePropName: "type",
    } as GeneratorOptions;
  };
}

function loadFixtureTests(): GeneratorOptions[] {
  return fs
    .readdirSync(path.resolve(__dirname, "__fixtures__/components"))
    .map(getGeneratorOptions());
}

it("generates value info for enums", () => {
  expect(
    generateDocgenCodeBlock(
      getGeneratorOptions({ shouldExtractLiteralValuesFromEnum: true })(
        "DefaultPropValue.tsx",
      ),
    ),
  ).toMatchSnapshot();
});
