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
  ComponentDoc,
} from "react-docgen-typescript/lib/parser.js";
import LoaderOptions from "./LoaderOptions";
import validateOptions from "./validateOptions";
import generateDocgenCodeBlock from "./generateDocgenCodeBlock";
import { getOptions } from "loader-utils";
import { getProgramProvider, ProgramProvider } from "./language-service";

export default function loader(
  this: webpack.loader.LoaderContext,
  source: string,
) {
  const callback = this.async();
  if (!callback) {
    throw new Error("Expected loader to operate in asynchronous mode.");
  }

  processResource(this, source).then(
    newSource => callback(null, newSource),
    error => callback(error),
  );
}

async function processResource(
  context: webpack.loader.LoaderContext,
  source: string,
): Promise<string> {
  // Mark the loader as being cacheable since the result should be
  // deterministic.
  context.cacheable(true);

  const options: LoaderOptions = getOptions(context) || {};
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

  let componentDocs: ComponentDoc[];
  let programProvider: ProgramProvider | undefined;

  if (options.experimentalLanguageServiceProvider) {
    programProvider = getProgramProvider(
      context,
      options,
      source,
      options.experimentalLanguageServiceProvider,
    );
  }

  componentDocs = parser.parse(context.resourcePath, programProvider);

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
