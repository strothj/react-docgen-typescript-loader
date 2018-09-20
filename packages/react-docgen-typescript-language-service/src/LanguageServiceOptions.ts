import { LoaderOptions } from "ts-loader/dist/interfaces";

export type CommonOptions =
  | "silent"
  | "logLevel"
  | "logInfoToStdOut"
  | "configFile"
  | "context"
  | "colors"
  | "compilerOptions";

export interface LanguageServiceOptions
  extends Partial<Pick<LoaderOptions, CommonOptions>> {
  /**
   * Used to differentiate the TypeScript instance based on the Webpack
   * instance.
   *
   * This should be set to the calculated instance name or a unique, unchanging,
   * value if used outside of a loader.
   *
   * ```
   * webpackIndex = webpackInstances.push(loader._compiler) - 1;
   *
   * const instanceName = webpackIndex + '_' + (loaderOptions.instance || 'default');
   * ```
   */
  instance: string;
}
