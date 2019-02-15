declare module "loader-utils" {
  import { loader } from "webpack";

  export function getOptions(context: loader.LoaderContext): object | null;
}
