import webpack from "webpack";
import * as ts from "typescript";
import path from "path";
import fs from "fs";
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
import { getOptions } from "loader-utils";

export interface TSFile {
  text?: string;
  version: number;
}

let languageService: ts.LanguageService | null = null;
const files: Map<string, TSFile> = new Map<string, TSFile>();

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
    componentNameResolver: options.componentNameResolver,
    propFilter:
      options.skipPropsWithName || options.skipPropsWithoutDoc
        ? {
            skipPropsWithName: options.skipPropsWithName || undefined,
            skipPropsWithoutDoc: options.skipPropsWithoutDoc || undefined,
          }
        : options.propFilter,
    shouldExtractLiteralValuesFromEnum:
      options.shouldExtractLiteralValuesFromEnum,
    savePropValueAsString: options.savePropValueAsString,
  };

  // Configure parser using settings provided to loader.
  // See: node_modules/react-docgen-typescript/lib/parser.d.ts
  let parser: FileParser = withDefaultConfig(parserOptions);

  let compilerOptions: ts.CompilerOptions = {
    allowJs: true,
  };
  let tsConfigFile: ts.ParsedCommandLine | null = null;

  if (options.tsconfigPath) {
    parser = withCustomConfig(options.tsconfigPath, parserOptions);

    tsConfigFile = getTSConfigFile(options.tsconfigPath!);
    compilerOptions = tsConfigFile.options;

    const filesToLoad = tsConfigFile.fileNames;
    loadFiles(filesToLoad);
  } else if (options.compilerOptions) {
    parser = withCompilerOptions(options.compilerOptions, parserOptions);
    compilerOptions = options.compilerOptions;
  }

  if (!tsConfigFile) {
    const basePath = path.dirname(context.context);
    tsConfigFile = getDefaultTSConfigFile(basePath);

    const filesToLoad = tsConfigFile.fileNames;
    loadFiles(filesToLoad);
  }

  const componentDocs = parser.parseWithProgramProvider(
    context.resourcePath,
    () => {
      if (languageService) {
        return languageService.getProgram()!;
      }

      const servicesHost = createServiceHost(compilerOptions, files);

      languageService = ts.createLanguageService(
        servicesHost,
        ts.createDocumentRegistry(),
      );

      return languageService!.getProgram()!;
    },
  );

  options.typePropName = options.typePropName || "type";

  // Return amended source code if there is docgen information available.
  if (componentDocs.length) {
    return generateDocgenCodeBlock({
      filename: context.resourcePath,
      source,
      componentDocs,
      docgenCollectionName: options.docgenCollectionName,
      setDisplayName: options.setDisplayName,
      typePropName: options.typePropName,
    });
  }

  // Return unchanged source code if no docgen information was available.
  return source;
}

function getTSConfigFile(tsconfigPath: string): ts.ParsedCommandLine {
  const basePath = path.dirname(tsconfigPath);
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(
    configFile!.config,
    ts.sys,
    basePath,
    {},
    tsconfigPath,
  );
}

function getDefaultTSConfigFile(basePath: string): ts.ParsedCommandLine {
  return ts.parseJsonConfigFileContent({}, ts.sys, basePath, {});
}

function loadFiles(filesToLoad: string[]): void {
  filesToLoad.forEach(filePath => {
    const normalizedFilePath = path.normalize(filePath);
    const file = files.get(normalizedFilePath);
    const text = fs.readFileSync(normalizedFilePath, "utf-8");

    if (!file) {
      files.set(normalizedFilePath, {
        text,
        version: 0,
      });
    } else if (file.text !== text) {
      files.set(normalizedFilePath, {
        text,
        version: file.version + 1,
      });
    }
  });
}

function createServiceHost(
  compilerOptions: ts.CompilerOptions,
  files: Map<string, TSFile>,
): ts.LanguageServiceHost {
  return {
    getScriptFileNames: () => {
      return [...files.keys()];
    },
    getScriptVersion: fileName => {
      const file = files.get(fileName);
      return (file && file.version.toString()) || "";
    },
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      let file = files.get(fileName);

      if (file === undefined) {
        const text = fs.readFileSync(fileName).toString();

        file = { version: 0, text };
        files.set(fileName, file);
      }

      return ts.ScriptSnapshot.fromString(file!.text!);
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  };
}
