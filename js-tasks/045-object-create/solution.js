/**
 * Кратко: Полифилл Object.
 */
export function objectCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
