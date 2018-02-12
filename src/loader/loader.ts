import * as webpack from "webpack";
import { parse as parseComponentDocs } from "react-docgen-typescript/lib/parser.js";
import { createAppError } from "../util";

const loader: webpack.loader.Loader = function(source) {
  // Loaders can support both synchronous and asynchronous modes. Prevent
  // manual execution as a synchronous loader because we will be perform async
  // operations.
  if (!this.async)
    throw createAppError("This loader can not be used synchronously.");

  // Mark the loader as being cacheable since the result should be
  // deterministic.
  this.cacheable(true);

  const componentDocs = parseComponentDocs(this.resourcePath);

  if (componentDocs.length) {
    //
  }

  return source;
};

export default loader;
