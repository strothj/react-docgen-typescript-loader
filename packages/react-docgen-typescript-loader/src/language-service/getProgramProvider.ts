import { loader, Compiler } from "webpack";
import LoaderOptions from "../LoaderOptions";
import { updateFileInCache } from "./updateFileInCache";
import path from "path";
import { ProgramProvider } from "./types";

const webpackInstances: Compiler[] = [];

export function getProgramProvider(
  context: loader.LoaderContext,
  options: LoaderOptions,
  source: string,
  languageServiceProvider: any,
): ProgramProvider {
  let webpackIndex = webpackInstances.indexOf(context._compiler);
  if (webpackIndex === -1) {
    webpackIndex = webpackInstances.push(context._compiler) - 1;
  }

  const instanceName = webpackIndex + "_docgen";

  const { instance, error } = languageServiceProvider(
    {
      instance: instanceName,
      configFile: options.tsconfigPath
        ? path.basename(options.tsconfigPath)
        : undefined,
      compilerOptions: options.compilerOptions
        ? options.compilerOptions
        : undefined,
    },
    context.context,
    context.resourcePath,
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!instance) {
    throw new Error("Could not retrieve language service instance");
  }

  updateFileInCache(context.resourcePath, source, instance);

  return () => instance.program!;
}
