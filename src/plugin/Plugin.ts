import * as webpack from "webpack";
import { parse } from "react-docgen-typescript/lib/parser.js";
import { validateOptions, Options } from "./Options";
import generateDocgenCodeBlock from "./generateDocgenCodeBlock";

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

function verboseLog(message: string) {
  console.log(`react-docgen-typescript-webpack-plugin: ${message}`);
}
