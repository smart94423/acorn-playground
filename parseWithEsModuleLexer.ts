import { init, parse } from "es-module-lexer";
import fs from "fs";
import { assertUsage } from "./utils";

// Failed attempt because es-module-lexer doesn't provide import names: https://github.com/guybedford/es-module-lexer/issues/100

const code = fs.readFileSync("./input.js").toString();

main();

async function main() {
  await init;

  const res = parse(code);
  console.log(res);
  const [importStatements] = res;
  importStatements.forEach((importStatement) => {
    assertUsage(importStatement.a === -1, "TODO");
    assertUsage(importStatement.d === -1, "TODO");
    // console.log(importStatement)
    console.log(code.slice(importStatement.ss, importStatement.se));
    console.log(code.slice(importStatement.s, importStatement.e));
    //code = splice(code, ss, se - ss, `file:${''}:${importStatement.a}`);
  });
}
