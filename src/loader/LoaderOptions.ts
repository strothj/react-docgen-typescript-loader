import { CompilerOptions } from "typescript";

export default interface LoaderOptions {
  /** Avoid including docgen information for the prop or props specified. */
  skipPropsWithName?: string[] | string;

  /** Avoid including docgen information for props without documentation. */
  skipPropsWithoutDoc?: boolean;

  /**
   * Specify the location of the tsconfig.json to use. Can not be used with
   * compilerOptions.
   **/
  tsconfigPath?: string;

  /** Specify TypeScript compiler options. Can not be used with tsconfigPath. */
  compilerOptions?: CompilerOptions;

  /**
   * Specify the docgen collection name to use. All docgen information will
   * be collected into this global object. Set to null to disable.
   *
   * Defaults to STORYBOOK_REACT_CLASSES.
   *
   * @see https://github.com/gongreg/react-storybook-addon-docgen
   **/
  docgenCollectionName?: string | null;
};
