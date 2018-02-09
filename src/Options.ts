import * as Ajv from "ajv";

export interface Options {
  includes: RegExp[];
  excludes: RegExp[];
  docgenCollectionName: string;
  verbose: boolean;
}

const ajv = new Ajv();

const validate = ajv.compile({
  type: "object",
  properties: {
    includes: {
      type: "array",
      items: {
        type: "object",
      },
    },
    excludes: {
      type: "array",
      items: {
        type: "object",
      },
    },
    docgenCollectionName: {
      type: "string",
    },
    verbose: {
      type: "boolean",
    },
  },
  additionalProperties: false,
});

export function validateOptions(options?: object) {
  if (options === undefined) return;

  const valid = validate(options);

  if (!valid) {
    const errorObj = validate.errors![0];
    let message = "react-docgen-typescript-webpack-plugin: ";
    if (errorObj.dataPath) message += errorObj.dataPath + " ";
    message += errorObj.message;

    throw new Error(message);
  }
}
