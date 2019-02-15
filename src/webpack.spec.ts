import fs from "fs";
import path from "path";
import webpack from "webpack";
// import MemoryFS = require("memory-fs");
import MemoryFS from "memory-fs";

describe("all component fixtures compile successfully", () => {
  const fixtureFilenames = fs
    .readdirSync(path.resolve(__dirname, "__fixtures__/components"))
    .sort();

  fixtureFilenames.forEach(filename => {
    it(`fixture: ${filename}`, async () => {
      const content = await compileFixture(filename);
      expect(content).toMatchSnapshot();
    });
  });
});

function compileFixture(filename: string): Promise<string> {
  const fs = new MemoryFS();
  const compiler = webpack(createWebpackConfig(filename));
  // @ts-ignore
  // TODO: The type definition for MemoryFS is missing the purge method, which
  // is now expected by the type definitions for Webpack.
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

      const fileContents = fs.readFileSync("/dist/component.js", "utf8");
      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.log(fileContents);
        reject(info.errors);
        return;
      }

      if (stats.hasWarnings()) {
        console.log(fileContents);
        reject(info.warnings);
        return;
      }

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
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  noEmit: false,
                },
              },
            },
            {
              loader: path.resolve(__dirname, "./loader"),
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
    // Make snapshots more readable by preventing source lines from being
    // wrapped in eval statements.
    devtool: false,
    // Make snapshots more readable by preventing minification.
    mode: "development",
  };
}
