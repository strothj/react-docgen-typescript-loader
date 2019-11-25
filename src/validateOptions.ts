import validate from "@webpack-contrib/schema-utils";
import LoaderOptions from "./LoaderOptions";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    skipPropsWithName: {
      anyOf: [
        { type: "string", minLength: 1 },
        { type: "array", minItems: 1, items: { type: "string", minLength: 1 } },
      ],
    },

    skipPropsWithoutDoc: {
      type: "boolean",
    },

    componentNameResolver: {
      // this is really { type: "function" }
      not: {
        oneOf: [
          { type: "string" },
          { type: "number" },
          { type: "object" },
          { type: "array" },
        ],
      },
    },

    propFilter: {
      // this is really { type: "function" }
      not: {
        oneOf: [
          { type: "string" },
          { type: "number" },
          { type: "object" },
          { type: "array" },
        ],
      },
    },

    tsconfigPath: {
      type: "string",
      minLength: 1,
    },

    compilerOptions: {
      type: "object",
    },

    docgenCollectionName: {
      anyOf: [{ type: "string", minLength: 1 }, { type: "null" }],
    },

    setDisplayName: {
      type: "boolean",
    },

    shouldExtractLiteralValuesFromEnum: {
      type: "boolean",
    },

    savePropValueAsString: {
      type: "boolean",
    },

    typePropName: {
      type: "string",
    },
  },
};

function validateOptions(options: LoaderOptions = {}) {
  validate({
    name: "react-docgen-typescript-loader",
    schema,
    target: options,
  });
}

export default validateOptions;
