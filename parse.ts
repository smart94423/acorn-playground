import { parse } from "acorn";
import fs from "fs";

const fileContent = fs.readFileSync("./input.js");
console.log(fileContent);
const res = parse(fileContent, {
  ecmaVersion: "latest",
  sourceType: "module",
});
console.log(res);
