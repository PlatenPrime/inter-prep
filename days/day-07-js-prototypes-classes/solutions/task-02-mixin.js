export function mixin(target, ...sources) {
  for (const src of sources) {
    for (const key of Object.keys(src)) target[key] = src[key];
    for (const sym of Object.getOwnPropertySymbols(src)) {
      if (Object.prototype.propertyIsEnumerable.call(src, sym)) {
        target[sym] = src[sym];
      }
    }
  }
  return target;
}