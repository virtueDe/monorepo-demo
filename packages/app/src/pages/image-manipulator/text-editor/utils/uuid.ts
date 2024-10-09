export function getUUID(): string {
  function S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `editor-${S4()}-${S4()}-${S4()}`;
}
