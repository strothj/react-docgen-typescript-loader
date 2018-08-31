import { LanguageServiceOptions } from "./LanguageServiceOptions";
import { makeLoaderOptions } from "./makeLoaderOptions";
import { instances, Webpack, Resolve } from "./tsLoader";

const { getTypeScriptInstance } = instances;

export function getLanguageServiceInstance(
  languageServiceOptions: LanguageServiceOptions,
  /**
   * The directory of the module. Can be used as context for resolving other stuff.
   */
  webpackContext: string,
  /**
   * The resource file.
   * eg: "/abc/resource.js"
   */
  webpackResourcePath: string,
) {
  const loaderOptions = makeLoaderOptions(languageServiceOptions);

  const createProxy = <T extends object>(name: string, target: T) =>
    new Proxy(target, {
      get: (target, property) => {
        if (!target.hasOwnProperty(property)) {
          throw new Error(
            `[get] Untrapped field in ${name}: ${property.toString()}`,
          );
        }

        return (target as any)[property];
      },
    });

  const webpack = {
    _compiler: {
      options: createProxy("webpack._compiler.options", {
        resolve: createProxy(
          "webpack._compiler.options.resolve",
          {} as Resolve,
        ),
      }),
      hooks: createProxy("webpack._compiler.hooks", {
        afterCompile: { tapAsync: () => {} },
        watchRun: { tapAsync: () => {} },
      }),
    },

    context: webpackContext,

    resourcePath: webpackResourcePath,
  } as Webpack;

  const webpackProxy = createProxy("webpack", webpack);

  return getTypeScriptInstance(loaderOptions, webpackProxy);
}
