import { parse } from "acorn";
import fs from "fs";
import type { Program, Identifier } from "estree";
import { assert, logObject, spliceMany, type SpliceOperation } from "./utils";

const code = fs.readFileSync("./input.js").toString();
const codeMod = replaceImportStatements(code);
console.log(codeMod);

function replaceImportStatements(code: string): string {
  const { body } = parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    // https://github.com/acornjs/acorn/issues/1136
  }) as any as Program;

  const spliceOperations: SpliceOperation[] = [];

  body.forEach((node) => {
    if (node.type !== "ImportDeclaration") return;

    logObject(node);
    console.log(code.slice(node.start, node.end));

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
  });

  const codeMod = spliceMany(code, spliceOperations);
  return codeMod;
}

// https://github.com/acornjs/acorn/issues/1136#issuecomment-1203671368
declare module "estree" {
  interface BaseNodeWithoutComments {
    start: number;
    end: number;
  }
}
