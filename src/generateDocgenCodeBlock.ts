import * as path from "path";
import { ComponentDoc } from "react-docgen-typescript/lib/parser.js";

export default function generateDocgenCodeBlock(
  componentDoc: ComponentDoc,
  filename: string,
  docgenCollectionName: string | null,
): string {
  const { displayName, description, props } = componentDoc;
  const docgenCollectionKeyBase = path
    .relative("./", path.resolve("./", filename))
    .replace(/\\/g, "/");

  return `
try {
  (exports.${displayName} || ${displayName}).displayName = "${displayName}";

  (exports.${displayName} || ${displayName}).__docgenInfo = {
    description: "${escapeString(description)}",
    displayName: "${displayName}",
    props: {
      ${Object.entries(props)
        .map(
          ([propName, prop]) =>
            `"${escapeString(propName)}": {
          defaultValue: ${
            prop.defaultValue != null &&
            typeof prop.defaultValue === "object" &&
            "value" in prop.defaultValue &&
            typeof prop.defaultValue.value === "string"
              ? ` {
                    value: "${escapeString(prop.defaultValue.value)}"
                  }`
              : null
          },
          description: "${escapeString(prop.description)}",
          name: "${prop.name}",
          required: ${prop.required ? "true" : "false"},
          type: {
            name: "${escapeString(prop.type.name)}"
          }
        }`,
        )
        .join(",\n")}
    }
  }

  ${
    docgenCollectionName
      ? `
  if (typeof ${docgenCollectionName} !== "undefined") {
    ${docgenCollectionName}["${docgenCollectionKeyBase}#${displayName}"] = {
      name: "${displayName}",
      docgenInfo: (exports.${displayName} || ${displayName}).__docgenInfo,
      path: "${escapeString(docgenCollectionKeyBase)}"
    }
  }
  `
      : ""
  }
} catch (e) {}
  `;
}

// Add escapes for quotes in strings.
// Replace newlines with \n.
// See: https://stackoverflow.com/questions/770523/escaping-strings-in-javascript
function escapeString(str: string): string {
  return (str + "")
    .replace(/[\\"']/g, "\\$&")
    .replace(/\u0000/g, "\\0")
    .replace(/\n/g, "\\n");
}
