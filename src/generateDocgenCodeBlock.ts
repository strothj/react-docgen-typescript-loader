import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { ComponentDoc } from "react-docgen-typescript/lib/parser.js";

export default function(
  filename: string,
  componentDocs: ComponentDoc[],
  docgenCollectionName?: string | null,
): string {
  const sourceFile = ts.createSourceFile(
    filename,
    fs.readFileSync(filename, "utf8"),
    ts.ScriptTarget.ESNext,
  );

  // SimpleComponent.displayName = "SimpleComponent";
  const setDisplayNameStatements = componentDocs.map(d =>
    ts.createStatement(
      ts.createBinary(
        ts.createPropertyAccess(
          ts.createIdentifier(d.displayName),
          ts.createIdentifier("displayName"),
        ),
        ts.SyntaxKind.EqualsToken,
        ts.createLiteral(d.displayName),
      ),
    ),
  );

  // (SimpleComponent as any).__docgenInfo = {
  //   description: "A simple component.",
  //   displayName: "SimpleComponent",
  //   props: {
  //     color: {
  //       defaultValue: null,
  //       description: "Button color.",
  //       name: "color",
  //       required: true,
  //       type: {
  //         name: "green | blue",
  //       },
  //     },
  //   },
  // };
  const setDocGenInfoStatements = componentDocs.map(d =>
    ts.createStatement(
      ts.createBinary(
        // SimpleComponent.__docgenInfo
        ts.createPropertyAccess(
          ts.createAsExpression(
            ts.createIdentifier(d.displayName),
            ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          ),
          ts.createIdentifier("__docgenInfo"),
        ),
        ts.SyntaxKind.EqualsToken,
        ts.createObjectLiteral([
          // SimpleComponent.description.
          ts.createPropertyAssignment(
            ts.createLiteral("description"),
            ts.createLiteral(d.description),
          ),
          // SimpleComponent.displayName.
          ts.createPropertyAssignment(
            ts.createLiteral("displayName"),
            ts.createLiteral(d.displayName),
          ),
          // SimpleComponent.props.
          ts.createPropertyAssignment(
            ts.createLiteral("props"),
            ts.createObjectLiteral(
              Object.entries(d.props).map(([propName, prop]) =>
                ts.createPropertyAssignment(
                  ts.createLiteral(propName),
                  ts.createObjectLiteral([
                    // SimpleComponent.props.defaultValue
                    ts.createPropertyAssignment(
                      ts.createLiteral("defaultValue"),
                      prop.defaultValue
                        ? ts.createObjectLiteral([
                            ts.createPropertyAssignment(
                              ts.createIdentifier("value"),
                              ts.createLiteral(prop.defaultValue.value),
                            ),
                          ])
                        : ts.createNull(),
                    ),
                    // SimpleComponent.props.description
                    ts.createPropertyAssignment(
                      ts.createLiteral("description"),
                      ts.createLiteral(prop.description),
                    ),
                    // SimpleComponent.props.description
                    ts.createPropertyAssignment(
                      ts.createLiteral("name"),
                      ts.createLiteral(prop.name),
                    ),
                    // SimpleComponent.props.required
                    ts.createPropertyAssignment(
                      ts.createLiteral("required"),
                      prop.required ? ts.createTrue() : ts.createFalse(),
                    ),
                    // SimpleComponent.props.type.
                    ts.createPropertyAssignment(
                      ts.createLiteral("type"),
                      ts.createObjectLiteral([
                        // SimpleComponent.props.type.name
                        ts.createPropertyAssignment(
                          ts.createLiteral("name"),
                          ts.createLiteral(prop.type.name),
                        ),
                      ]),
                    ),
                  ]),
                ),
              ),
            ),
          ),
        ]),
      ),
    ),
  );

  const relativeFilename = path
    .relative("./", path.resolve("./", filename))
    .replace(/\\/g, "/");

  // if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  //   STORYBOOK_REACT_CLASSES["src/plugin/__fixtures__/components/SimpleComponent.tsx#SimpleComponent"] = {
  //     name: "SimpleComponent",
  //     docgenInfo: SimpleComponent.__docgenInfo,
  //     path: "src/plugin/__fixtures__/components/SimpleComponent.tsx"
  //   }
  // }
  const insertDocInfoIntoCollectionStatements =
    docgenCollectionName != null
      ? componentDocs.map(d =>
          ts.createIf(
            ts.createBinary(
              ts.createTypeOf(ts.createIdentifier(docgenCollectionName)),
              ts.SyntaxKind.ExclamationEqualsEqualsToken,
              ts.createLiteral("undefined"),
            ),
            ts.createStatement(
              ts.createBinary(
                ts.createElementAccess(
                  ts.createIdentifier(docgenCollectionName),
                  ts.createLiteral(`${relativeFilename}#${d.displayName}`),
                ),
                ts.SyntaxKind.EqualsToken,
                ts.createObjectLiteral([
                  ts.createPropertyAssignment(
                    ts.createIdentifier("name"),
                    ts.createLiteral(d.displayName),
                  ),
                ]),
              ),
            ),
          ),
        )
      : [];

  const tryStatement = ts.createTry(
    ts.createBlock(
      [
        ...setDisplayNameStatements,
        ...setDocGenInfoStatements,
        ...insertDocInfoIntoCollectionStatements,
      ],
      true,
    ),
    ts.createCatchClause(
      ts.createVariableDeclaration(
        ts.createIdentifier("__react_docgen_typescript_loader_error"),
      ),
      ts.createBlock([]),
    ),
    undefined,
  );

  // declare var STORYBOOK_REACT_CLASSES: any;
  const createKeywordDeclaration =
    !!docgenCollectionName &&
    ts.createVariableStatement(
      [ts.createToken(ts.SyntaxKind.DeclareKeyword)],
      ts.createVariableDeclarationList([
        ts.createVariableDeclaration(
          ts.createIdentifier(docgenCollectionName),
          ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
        ),
      ]),
    );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  let result =
    printer.printNode(ts.EmitHint.Unspecified, sourceFile, sourceFile) +
    printer.printNode(ts.EmitHint.Unspecified, tryStatement, sourceFile);
  if (docgenCollectionName)
    result += printer.printNode(
      ts.EmitHint.Unspecified,
      createKeywordDeclaration as ts.VariableStatement,
      sourceFile,
    );

  return result;
}
