import { CompilerOptions } from "typescript";
import { PropFilter } from "react-docgen-typescript/lib/parser.js";

export default interface LoaderOptions {
  /** Avoid including docgen information for the prop or props specified. */
  skipPropsWithName?: string[] | string;

  /** Avoid including docgen information for props without documentation. */
  skipPropsWithoutDoc?: boolean;

  /**
   * Specify function to filter props.
   * If either skipPropsWithName or skipPropsWithoutDoc will be specified this will not be used.
   */
  propFilter?: PropFilter;
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
   * @default STORYBOOK_REACT_CLASSES
   * @see https://github.com/gongreg/react-storybook-addon-docgen
   **/
  docgenCollectionName?: string | null;

  /**
   * Automatically set the component's display name. If you want to set display
   * names yourself or are using another plugin to do this, you should disable
   * this option.
   *
   * ```
   * class MyComponent extends React.Component {
   * ...
   * }
   *
   * MyComponent.displayName = "MyComponent";
   * ```
   *
   * @default true
   */
  setDisplayName?: boolean;
}
