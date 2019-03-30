import path from "path";
import webpack from "webpack";
import loader from "./loader";

// TODO: Isolate loader.ts dependencies and test in isolation.
// TODO: Test error handling in asynchronous vs synchronous mode.

const mockLoaderContextAsyncCallback = jest.fn();
const mockLoaderContextCacheable = jest.fn();
const mockLoaderContextResourcePath = jest.fn();
const mockLoaderContextContext = jest.fn();

beforeEach(() => {
  mockLoaderContextAsyncCallback.mockReset();
  mockLoaderContextCacheable.mockReset();
  mockLoaderContextResourcePath.mockReset();
  mockLoaderContextContext.mockReset();
  mockLoaderContextResourcePath.mockImplementation(() =>
    path.resolve(__dirname, "./__fixtures__/components/Simple.tsx"),
  );
  mockLoaderContextContext.mockImplementation(() =>
    path.resolve(__dirname, "./__fixtures__/"),
  );
});

it("marks the loader as being cacheable", () => {
  executeLoaderWithBoundContext();

  expect(mockLoaderContextCacheable.mock.calls[0][0]).toEqual(true);
});

// Execute loader with its "this" set to an instance of LoaderContext.
function executeLoaderWithBoundContext() {
  loader.call(
    ({
      async: mockLoaderContextAsyncCallback,
      cacheable: mockLoaderContextCacheable,
      resourcePath: mockLoaderContextResourcePath(),
      context: mockLoaderContextContext(),
    } as Pick<
      webpack.loader.LoaderContext,
      "async" | "cacheable" | "resourcePath" | "context"
    >) as webpack.loader.LoaderContext,
    "// Original Source Code",
  );
}
