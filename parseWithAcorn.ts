import { parse } from "acorn";
import fs from "fs";

const fileContent = fs.readFileSync("./input.js").toString();
console.log(fileContent);
const res = parse(fileContent, {
  ecmaVersion: "latest",
  sourceType: "module",
});
console.log(res);
console.log(JSON.stringify(res, null, 2));
