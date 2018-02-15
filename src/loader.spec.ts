import * as path from "path";
import * as webpack from "webpack";
import loader from "./loader";

// TODO: Isolate loader.ts dependencies and test in isolation.
// TODO: Test error handling in asynchronous vs synchronous mode.

const mockLoaderContextAsyncCallback = jest.fn();
const mockLoaderContextCacheable = jest.fn();
const mockLoaderContextResourcePath = jest.fn();

beforeEach(() => {
  mockLoaderContextAsyncCallback.mockReset();
  mockLoaderContextCacheable.mockReset();
  mockLoaderContextResourcePath.mockReset();
  mockLoaderContextResourcePath.mockImplementation(() =>
    path.resolve(__dirname, "./__fixtures__/components/Simple.tsx"),
  );
});

it("marks the loader as being cacheable", () => {
  executeLoaderWithBoundContext();

  expect(mockLoaderContextCacheable.mock.calls[0][0]).toEqual(true);
});

// Execute loader with its "this" set to an instance of LoaderContext.
function executeLoaderWithBoundContext() {
  loader.call(
    {
      async: mockLoaderContextAsyncCallback,
      cacheable: mockLoaderContextCacheable,
      resourcePath: mockLoaderContextResourcePath(),
    } as Partial<webpack.loader.LoaderContext>,
    "// Original Source Code",
  );
}
