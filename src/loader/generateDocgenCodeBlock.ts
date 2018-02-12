/*
import * as fs from "fs";
import * as ts from "typescript";

const sourceFile = ts.createSourceFile(
  this.resourcePath,
  fs.readFileSync(this.resourcePath).toString(),
  ts.ScriptTarget.ESNext,
  true / setParentNodes /,
);

// ts.updateSourceFileNode(sourceFile, [...sourceFile.statements,

// ])
const tryBlock = ts.createTry(
  ts.createBlock([], true),
  ts.createCatchClause(
    ts.createVariableDeclaration(
      ts.createIdentifier("__react_docgen_typescript_webpack_plugin_error"),
    ),
    ts.createBlock([]),
  ),
  undefined,
);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const result =
  printer.printNode(ts.EmitHint.Unspecified, sourceFile, sourceFile) +
  printer.printNode(ts.EmitHint.Unspecified, tryBlock, sourceFile);

console.log(result);
*/
