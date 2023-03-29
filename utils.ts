export { assertUsage };
export { splice };

function assertUsage(condition: unknown, msg: string): asserts condition {
  if (condition) return;
  throw new Error("[Wrong Usage] " + msg);
}

function splice(
  str: string,
  index: number,
  count: number,
  add: string
): string {
  return str.slice(0, index) + add + str.slice(index + count);
}
