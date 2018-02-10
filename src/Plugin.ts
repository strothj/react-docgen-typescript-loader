import * as path from "path";
import * as webpack from "webpack";
import { parse, ComponentDoc } from "react-docgen-typescript/lib/parser.js";
import { validateOptions, Options } from "./Options";

class Plugin implements webpack.Plugin {
  private options: {
    includes: RegExp[];
    excludes: RegExp[];
    docgenCollectionName: string | null;
  };
  private log: (message: string) => void;

  constructor(options: Partial<Options> = {}) {
    validateOptions(options);

    this.options = {
      includes: options.includes || [/\.tsx$/],
      excludes: options.excludes || [/node_modules/],
      docgenCollectionName:
        options.docgenCollectionName || "STORYBOOK_REACT_CLASSES",
    };
    this.log = options.verbose ? verboseLog : () => {};
  }

  apply = (compiler: webpack.Compiler) => {
    compiler.plugin("compilation", (compilation: any) => {
      compilation.plugin("seal", () => {
        compilation.modules.forEach((module: any) => {
          // Skip ignored / external modules
          if (!module.built || module.external || !module.rawRequest) {
            this.log(`Ignoring module request: ${module.request}`);
            return;
          }

          // Check module against whitelist/blacklist.
          if (!this.shouldProcess(module)) return;

          this.log(`Processing request: ${module.request}`);

          // Generate doc types.
          processModule(module, this.options.docgenCollectionName);
        });
      });
    });
  };

  // Check module filename against the include and exclude options.
  private shouldProcess = (module: any): boolean => {
    let shouldProcess = this.options.includes.some(i =>
      i.test(module.userRequest),
    );
    if (!shouldProcess) {
      // this.log(
      //   `Ignoring module because it did not match includes: ${module.request}`,
      // );
      return false;
    }

    shouldProcess = !this.options.excludes.some(i =>
      i.test(module.userRequest),
    );
    if (!shouldProcess) {
      // this.log(
      //   `Ignoring module because it matched excludes: ${module.request}`,
      // );
      return false;
    }

    return true;
  };
}

export default Plugin;

function processModule(module: any, docgenCollectionName: string | null) {
  const componentDocs = parse(module.userRequest);
  if (!componentDocs.length) return;

  let source = module._source._value;
  componentDocs.forEach(componentDoc => {
    source +=
      "\n" +
      generateDocgenCodeBlock(
        componentDoc,
        module.userRequest,
        docgenCollectionName,
      ) +
      "\n";
  });
  module._source._value = source;
}

function generateDocgenCodeBlock(
  componentDoc: ComponentDoc,
  filename: string,
  docgenCollectionName: string | null,
): string {
  const { displayName, description, props } = componentDoc;
  const docgenCollectionKeyBase = path
    .relative("./", path.resolve("./", filename))
    .replace(/\\/g, "/");

  return `
try {
  (exports.${displayName} || ${displayName}).displayName = "${displayName}";

  (exports.${displayName} || ${displayName}).__docgenInfo = {
    description: "${escapeString(description)}",
    displayName: "${displayName}",
    props: {
      ${Object.entries(props)
        .map(
          ([propName, prop]) =>
            `${propName}: {
          defaultValue: null,
          description: "${escapeString(prop.description)}",
          name: "${prop.name}",
          required: ${prop.required ? "true" : "false"},
          type: {
            name: "${escapeString(prop.type.name)}"
          }
        }`,
        )
        .join(",\n")}
    }
  }

  ${
    docgenCollectionName
      ? `
  if (typeof ${docgenCollectionName} !== "undefined") {
    ${docgenCollectionName}["${docgenCollectionKeyBase}#${displayName}"] = {
      name: "${displayName}",
      docgenInfo: (exports.${displayName} || ${displayName}).__docgenInfo,
      path: "${escapeString(docgenCollectionKeyBase)}"
    }
  }
  `
      : ""
  }
} catch (e) {}
  `;
}

// Add escapes for quotes in strings.
// Replace newlines with \n.
// See: https://stackoverflow.com/questions/770523/escaping-strings-in-javascript
function escapeString(str: string): string {
  return (str + "")
    .replace(/[\\"']/g, "\\$&")
    .replace(/\u0000/g, "\\0")
    .replace(/\n/g, "\\n");
}

function verboseLog(message: string) {
  console.log(`react-docgen-typescript-webpack-plugin: ${message}`);
}
