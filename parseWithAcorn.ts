import { parse } from "acorn";
import fs from "fs";
import type { Program, Identifier } from "estree";
import { assert, logObject, spliceMany } from "./utils";

declare module "estree" {
  interface BaseNodeWithoutComments {
    start: number;
    end: number;
  }
}

const code = fs.readFileSync("./input.js").toString();
const codeMod = replaceImportStatements(code);
console.log(codeMod);

function replaceImportStatements(code: string): string {
  const res = parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    // https://github.com/acornjs/acorn/issues/1136
  }) as any as Program;

  //logObject(res)

  const spliceOperations: {
    start: number;
    end: number;
    replacement: string;
  }[] = [];

  res.body
    .filter((node) => node.type === "ImportDeclaration")
    .forEach((node) => {
      assert(node.type === "ImportDeclaration");
      const file = node.source.value;
      assert(file);

      let replacement = "";
      node.specifiers.forEach((specifier) => {
        assert(
          specifier.type === "ImportSpecifier" ||
            specifier.type === "ImportDefaultSpecifier"
        );
        const importVar = specifier.local.name;
        const importName = (() => {
          if (specifier.type === "ImportDefaultSpecifier") return "default";
          {
            const imported = (specifier as any).imported as
              | Identifier
              | undefined;
            if (imported) return imported.name;
          }
          return importVar;
        })();
        replacement += `const ${importVar} = '__import|${file}|${importName}';`;
      });
      assert(replacement.length > 0);

      const { start, end } = node;
      spliceOperations.push({
        start,
        end,
        replacement,
      });
      // logObject(node);
      // console.log(code.slice(node.start, node.end));
    });

  const codeMod = spliceMany(code, spliceOperations);
  return codeMod;
}
