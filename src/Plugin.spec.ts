import * as path from "path";
import * as webpack from "webpack";
import MemoryFS = require("memory-fs");
import Plugin from "./Plugin";

it("compiles", async () => {
  const contents = await compileFixture("Component.tsx");
  expect(contents).toMatchSnapshot();
});

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
    entry: path.resolve(__dirname, `./__fixtures__/${filename}`),
    output: {
      filename: "component.js",
      path: "/dist",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["ts-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    externals: {
      react: "react",
    },
    plugins: [
      new Plugin({
        docgenCollectionName: "STORYBOOK_REACT_CLASSES",
        includes: [/__fixtures__[\\/].+\.tsx/],
      }),
    ],
  };
}
