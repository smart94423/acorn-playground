export { assertUsage };
export { assert };
export { logObject };
// export { splice };
export { spliceMany };
export type { SpliceOperation };

function assert(condition: unknown): asserts condition {
  if (condition) return;
  throw new Error("Internal Error");
}

function assertUsage(condition: unknown, msg: string): asserts condition {
  if (condition) return;
  throw new Error("[Wrong Usage] " + msg);
}

function logObject(obj: Object) {
  console.log(JSON.stringify(obj, null, 2));
}

/*
function splice(
  str: string,
  index: number,
  count: number,
  add: string
): string {
  return str.slice(0, index) + add + str.slice(index + count);
}
*/

type SpliceOperation = {
  start: number;
  end: number;
  replacement: string;
};
function spliceMany(str: string, operations: SpliceOperation[]): string {
  let strMod = "";
  let endPrev: number | undefined;
  operations.forEach(({ start, end, replacement }) => {
    if (endPrev !== undefined) {
      assert(endPrev < start);
    } else {
      endPrev = 0;
    }
    strMod += str.slice(endPrev, start) + replacement;
    endPrev = end;
  });
  strMod += str.slice(endPrev, str.length - 1);
  return strMod;
}
