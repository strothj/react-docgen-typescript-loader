import * as webpack from "webpack";
import {
  withDefaultConfig,
  withCustomConfig,
  withCompilerOptions,
  ParserOptions,
  FileParser,
} from "react-docgen-typescript/lib/parser.js";
import LoaderOptions from "./LoaderOptions";
import validateOptions from "./validateOptions";
import generateDocgenCodeBlock from "./generateDocgenCodeBlock";

const loader: webpack.loader.Loader = function(source) {
  const callback = this.async();
  try {
    // Mark the loader as being cacheable since the result should be
    // deterministic.
    this.cacheable(true);

    const options: LoaderOptions = this.query || {};
    validateOptions(options);
    options.docgenCollectionName =
      options.docgenCollectionName || "STORYBOOK_REACT_CLASSES";

    // Convert loader's flat options into expected structure for
    // react-docgen-typescript.
    // See: node_modules/react-docgen-typescript/lib/parser.d.ts
    const parserOptions: ParserOptions = {
      propFilter:
        options.skipPropsWithName || options.skipPropsWithoutDoc
          ? {
              skipPropsWithName: options.skipPropsWithName || undefined,
              skipPropsWithoutDoc: options.skipPropsWithoutDoc || undefined,
            }
          : undefined,
    };

    const newSource = (() => {
      // Configure parser using settings provided to loader.
      // See: node_modules/react-docgen-typescript/lib/parser.d.ts
      let parser: FileParser = withDefaultConfig(parserOptions);
      if (options.tsconfigPath)
        parser = withCustomConfig(options.tsconfigPath, parserOptions);
      else if (options.compilerOptions)
        parser = withCompilerOptions(options.compilerOptions, parserOptions);

      const componentDocs = parser.parse(this.resourcePath);

      // Return amended source code if there is docgen information available.
      if (componentDocs.length) {
        return generateDocgenCodeBlock(
          this.resourcePath,
          source as string,
          componentDocs,
          options.docgenCollectionName,
        );
      }

      // Return unchanged source code if no docgen information was available.
      return source;
    })();

    if (!callback) return newSource;
    callback(null, newSource);
    return;
  } catch (e) {
    if (callback) {
      callback(e);
      return;
    }
    throw e;
  }
};

export default loader;
