import { init, parse } from "es-module-lexer";
import fs from "fs";

const fileContent = fs.readFileSync("./input.js").toString();

await init;

const res = parse(fileContent);

console.log(res);
