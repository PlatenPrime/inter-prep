export function getPrototypeChain(obj) {
  const chain = [];
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}