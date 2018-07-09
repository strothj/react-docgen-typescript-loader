import webpack from "webpack";
// TODO: Import from "react-docgen-typescript" directly when
// https://github.com/styleguidist/react-docgen-typescript/pull/104 is hopefully
// merged in. Will be considering to make a peer dependency as that point.
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

export default function loader(
  this: webpack.loader.LoaderContext,
  source: string,
) {
  // Loaders can operate in either synchronous or asynchronous mode. Errors in
  // asynchronous mode should be reported using the supplied callback.

  // Will return a callback if operating in asynchronous mode.
  const callback = this.async();

  try {
    const newSource = processResource(this, source);

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
}

function processResource(
  context: webpack.loader.LoaderContext,
  source: string,
): string {
  // Mark the loader as being cacheable since the result should be
  // deterministic.
  context.cacheable(true);

  const options: LoaderOptions = context.query || {};
  validateOptions(options);
  options.docgenCollectionName =
    options.docgenCollectionName || "STORYBOOK_REACT_CLASSES";
  if (typeof options.setDisplayName !== "boolean") {
    options.setDisplayName = true;
  }

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
        : options.propFilter,
  };

  // Configure parser using settings provided to loader.
  // See: node_modules/react-docgen-typescript/lib/parser.d.ts
  let parser: FileParser = withDefaultConfig(parserOptions);
  if (options.tsconfigPath) {
    parser = withCustomConfig(options.tsconfigPath, parserOptions);
  } else if (options.compilerOptions) {
    parser = withCompilerOptions(options.compilerOptions, parserOptions);
  }

  const componentDocs = parser.parse(context.resourcePath);

  // Return amended source code if there is docgen information available.
  if (componentDocs.length) {
    return generateDocgenCodeBlock({
      filename: context.resourcePath,
      source,
      componentDocs,
      docgenCollectionName: options.docgenCollectionName,
      setDisplayName: options.setDisplayName,
    });
  }

  // Return unchanged source code if no docgen information was available.
  return source;
}
