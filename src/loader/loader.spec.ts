import * as path from "path";
import * as webpack from "webpack";
import MemoryFS = require("memory-fs");
import loader from "./loader";

const mockLoaderContextAsyncCallback = jest.fn();
const mockLoaderContextCacheable = jest.fn();
const mockLoaderContextResourcePath = jest.fn();

beforeEach(() => {
  mockLoaderContextAsyncCallback.mockReset();
  mockLoaderContextCacheable.mockReset();
  mockLoaderContextResourcePath.mockReset();
  mockLoaderContextResourcePath.mockImplementation(() =>
    path.resolve(__dirname, "./__fixtures__/components/SimpleComponent.tsx"),
  );
});

it("marks the loader as being cacheable", () => {
  executeLoaderWithBoundContext();

  expect(mockLoaderContextCacheable.mock.calls[0][0]).toEqual(true);
});

it("compiles using Webpack", async () => {
  const contents = await compileFixture("SimpleComponent.tsx");
  expect(contents).toMatchSnapshot();
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

function compileFixture(filename: string): Promise<string> {
  const fs = new MemoryFS();
  const compiler = webpack(createWebpackConfig(filename));
  compiler.outputFileSystem = fs;

  // The following executes the Webpack compiler and checks for the three
  // possible error conditions (fatal webpack errors, compilation errors,
  // compilation warnings).
  // See: https://webpack.js.org/api/node/#error-handling
  return new Promise<string>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      const info = stats.toJson();
      if (stats.hasErrors()) {
        reject(info.errors);
        return;
      }

      if (stats.hasWarnings()) {
        reject(info.warnings);
        return;
      }

      const fileContents = fs.readFileSync("/dist/component.js", "utf8");
      resolve(fileContents);
    });
  });
}

function createWebpackConfig(filename: string): webpack.Configuration {
  return {
    context: path.resolve(__dirname, ".."),
    entry: path.resolve(__dirname, `./__fixtures__/components/${filename}`),
    output: {
      filename: "component.js",
      path: "/dist",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            "ts-loader",
            {
              loader: path.resolve(__dirname, "./loader"),
              options: {
                test: "test",
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    resolveLoader: {
      extensions: [".ts"],
    },
    externals: {
      react: "react",
    },
  };
}