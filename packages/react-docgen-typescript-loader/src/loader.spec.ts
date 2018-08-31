import path from "path";
import webpack from "webpack";
import loader from "./loader";

type LoaderCallback = webpack.loader.loaderCallback;

// TODO: Isolate loader.ts dependencies and test in isolation.
// TODO: Test error handling in asynchronous vs synchronous mode.

const mockLoaderContextCacheable = jest.fn();
const mockLoaderContextResourcePath = jest.fn();

beforeEach(() => {
  mockLoaderContextCacheable.mockReset();
  mockLoaderContextResourcePath.mockReset();
  mockLoaderContextResourcePath.mockImplementation(() =>
    path.resolve(__dirname, "./__fixtures__/components/Simple.tsx"),
  );
});

it("marks the loader as being cacheable", done => {
  const loaderCallback: LoaderCallback = (error, content) => {
    if (error) {
      done(error);
      return;
    }

    expect(mockLoaderContextCacheable.mock.calls[0][0]).toEqual(true);
    expect(content).toBeTruthy();
    done();
  };

  executeLoaderWithBoundContext(loaderCallback);
});

// Execute loader with its "this" set to an instance of LoaderContext.
function executeLoaderWithBoundContext(loaderCallback: LoaderCallback) {
  loader.call(
    {
      async: () => loaderCallback,
      cacheable: mockLoaderContextCacheable,
      resourcePath: mockLoaderContextResourcePath(),
    } as Partial<webpack.loader.LoaderContext>,
    "// Original Source Code",
  );
}
