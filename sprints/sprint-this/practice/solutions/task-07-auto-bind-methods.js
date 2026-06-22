/**
 * autoBindMethods — solution
 */


export function autoBindMethods(obj) {
  for (const key of Reflect.ownKeys(obj)) {
    const val = obj[key];
    if (typeof val === 'function' && key !== 'constructor') {
      obj[key] = val.bind(obj);
    }
  }
  return obj;
}
