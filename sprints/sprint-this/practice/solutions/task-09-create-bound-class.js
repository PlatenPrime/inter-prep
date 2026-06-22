/**
 * createBoundClass — solution
 */


export function createBoundClass(Base) {
  return class Bound extends Base {
    constructor(...args) {
      super(...args);
      for (const key of Object.getOwnPropertyNames(Base.prototype)) {
        if (key === 'constructor') continue;
        const fn = Base.prototype[key];
        if (typeof fn === 'function') this[key] = fn.bind(this);
      }
    }
  };
}
