import webpack from "webpack";
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

function loader(this: webpack.loader.LoaderContext, source: string) {
  // Loaders can operate in either synchronous or asynchronous mode. Errors in
  // asynchronous mode should be reported using the supplied callback.

  // Will return a callback if operating in asynchronous mode.
  const callback = this.async();

  try {
    const newSource = processResource.call(this, source);

    if (!callback) return newSource;
    callback(null, newSource);
  } catch (e) {
    if (callback) {
      callback(e);
      return;
    }
    throw e;
  }
}

function processResource(
  this: webpack.loader.LoaderContext,
  source: string,
): string {
  // Mark the loader as being cacheable since the result should be
  // deterministic.
  this.cacheable(true);

  const options: LoaderOptions = this.query || {};
  validateOptions(options);
  options.docgenCollectionName =
    options.docgenCollectionName || "STORYBOOK_REACT_CLASSES";

  // Convert the loader's flat options into the expected structure for
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
    return generateDocgenCodeBlock({
      filename: this.resourcePath,
      source,
      componentDocs,
      docgenCollectionName: options.docgenCollectionName,
    });
  }

  // Return unchanged source code if no docgen information was available.
  return source;
}

export default loader;
