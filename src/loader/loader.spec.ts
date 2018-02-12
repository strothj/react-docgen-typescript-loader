import * as path from "path";
import * as webpack from "webpack";
import loader from "./loader";

const mockLoaderContextAsyncCallback = jest.fn();
const mockLoaderContextCacheable = jest.fn();
const mockLoaderContextResourcePath = jest.fn();

beforeEach(() => {
  mockLoaderContextAsyncCallback.mockReset();
  mockLoaderContextCacheable.mockReset();
  mockLoaderContextResourcePath.mockReset();
  mockLoaderContextResourcePath.mockImplementation(() =>
    path.resolve(__dirname, "./__fixtures__/SimpleComponent.tsx"),
  );
});

it("throws error if used synchronously", () => {
  // Loader expects to have "this" bound to an instance of LoaderContext.
  const synchronouslyLoaderContext = {} as webpack.loader.LoaderContext & {
    loader: webpack.loader.Loader;
  };
  synchronouslyLoaderContext.loader = loader;

  expect(() =>
    synchronouslyLoaderContext.loader("", ""),
  ).toThrowErrorMatchingSnapshot();
});

it("marks the loader as being cacheable", () => {
  executeLoaderWithBoundContext();

  expect(mockLoaderContextCacheable.mock.calls[0][0]).toEqual(true);
});

// Execute loader with its "this" set to an instance of LoaderContext.
function executeLoaderWithBoundContext() {
  const mockLoaderContext = {} as webpack.loader.LoaderContext & {
    loader: webpack.loader.Loader;
  };

  mockLoaderContext.async = mockLoaderContextAsyncCallback;
  mockLoaderContext.cacheable = mockLoaderContextCacheable;
  mockLoaderContext.loader = loader;
  mockLoaderContext.resourcePath = mockLoaderContextResourcePath();

  mockLoaderContext.loader("// Original Source Code", "");
}
