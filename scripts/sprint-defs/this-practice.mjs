/** @type {import('../generate-sprints.mjs').PracticeTask[]} */
export const thisPractice = [
  {
    file: 'task-01-my-call',
    title: 'myCall',
    description: 'Implement Function.prototype.call using a temporary object.',
    exportName: 'myCall',
    params: 'fn, thisArg, ...args',
    sig: '',
    solution: `export function myCall(fn, thisArg, ...args) {
  if (thisArg == null) return fn(...args);
  const obj = Object(thisArg);
  const key = Symbol('call');
  obj[key] = fn;
  try {
    return obj[key](...args);
  } finally {
    delete obj[key];
  }
}`,
    test: `assert(myCall(function (a, b) { return this.x + a + b; }, { x: 10 }, 1, 2) === 13);
assert(myCall((a, b) => a + b, null, 1, 2) === 3);`,
  },
  {
    file: 'task-02-my-apply',
    title: 'myApply',
    description: 'Implement Function.prototype.apply with array-like args.',
    exportName: 'myApply',
    params: 'fn, thisArg, args',
    sig: `/**
 * @param {Function} fn
 * @param {unknown} thisArg
 * @param {ArrayLike<unknown>} [args]
 */`,
    solution: `export function myApply(fn, thisArg, args = []) {
  return myCall(fn, thisArg, ...Array.from(args));
}

function myCall(fn, thisArg, ...callArgs) {
  if (thisArg == null) return fn(...callArgs);
  const obj = Object(thisArg);
  const key = Symbol('call');
  obj[key] = fn;
  try {
    return obj[key](...callArgs);
  } finally {
    delete obj[key];
  }
}`,
    test: `assert(myApply(function (a, b) { return this.v + a + b; }, { v: 5 }, [1, 2]) === 8);`,
  },
  {
    file: 'task-03-my-bind',
    title: 'myBind',
    description: 'Implement bind with partial args and new-operator support.',
    exportName: 'myBind',
    params: 'fn, thisArg, ...bound',
    sig: '',
    solution: `export function myBind(fn, thisArg, ...bound) {
  function boundFn(...args) {
    const isNew = new.target !== undefined;
    if (isNew) {
      const result = fn.apply(this, [...bound, ...args]);
      return result !== null && typeof result === 'object' ? result : this;
    }
    return fn.apply(thisArg, [...bound, ...args]);
  }
  boundFn.prototype = Object.create(fn.prototype);
  return boundFn;
}`,
    test: `function add(a, b) { return (this.base || 0) + a + b; }
const b = myBind(add, { base: 10 }, 1);
assert(b(2) === 13);
function Person(name) { this.name = name; }
const Bound = myBind(Person, null);
const p = new Bound('Ann');
assert(p.name === 'Ann');`,
  },
  {
    file: 'task-04-my-new',
    title: 'myNew',
    description: 'Implement the new operator.',
    exportName: 'myNew',
    params: 'Constructor, ...args',
    sig: '',
    solution: `export function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result !== null && typeof result === 'object' ? result : obj;
}`,
    test: `function Box(v) { this.v = v; }
Box.prototype.get = function () { return this.v; };
const b = myNew(Box, 42);
assert(b.v === 42 && b.get() === 42);`,
  },
  {
    file: 'task-05-resolve-this',
    title: 'resolveThis',
    description: 'Predict this for a call site descriptor.',
    exportName: 'resolveThis',
    params: 'descriptor',
    sig: `/**
 * @typedef {{ mode: 'global'|'method'|'call'|'apply'|'bind'|'new'|'arrow'; obj?: object; ctx?: unknown; strict?: boolean; lexicalThis?: unknown }} CallDescriptor
 * @param {CallDescriptor} descriptor
 * @returns {unknown}
 */`,
    solution: `export function resolveThis(descriptor) {
  const { mode, obj, ctx, strict = true } = descriptor;
  switch (mode) {
    case 'global':
      return strict ? undefined : globalThis;
    case 'method':
      return obj;
    case 'call':
    case 'apply':
    case 'bind':
      return ctx;
    case 'new':
      return {};
    case 'arrow':
      return descriptor.lexicalThis;
    default:
      return undefined;
  }
}`,
    test: `const o = { id: 1 };
assert(resolveThis({ mode: 'method', obj: o }) === o);
assert(resolveThis({ mode: 'global', strict: true }) === undefined);
assert(resolveThis({ mode: 'call', ctx: { x: 1 } }).x === 1);
assert(resolveThis({ mode: 'arrow', lexicalThis: { y: 2 } }).y === 2);`,
  },
  {
    file: 'task-06-soft-bind',
    title: 'softBind',
    description: 'Soft bind: use thisArg only if this is global/undefined.',
    exportName: 'softBind',
    params: 'fn, thisArg',
    sig: '',
    solution: `export function softBind(fn, thisArg) {
  return function (...args) {
    const ctx = (this === globalThis || this === undefined) ? thisArg : this;
    return fn.apply(ctx, args);
  };
}`,
    test: `function greet() { return this.name; }
const soft = softBind(greet, { name: 'default' });
assert(soft() === 'default');
assert(soft.call({ name: 'override' }) === 'override');`,
  },
  {
    file: 'task-07-auto-bind-methods',
    title: 'autoBindMethods',
    description: 'Bind all own methods of an object to the object.',
    exportName: 'autoBindMethods',
    params: 'obj',
    sig: '',
    solution: `export function autoBindMethods(obj) {
  for (const key of Reflect.ownKeys(obj)) {
    const val = obj[key];
    if (typeof val === 'function' && key !== 'constructor') {
      obj[key] = val.bind(obj);
    }
  }
  return obj;
}`,
    test: `const user = {
  name: 'Ann',
  greet() { return this.name; },
};
autoBindMethods(user);
const fn = user.greet;
assert(fn() === 'Ann');`,
  },
  {
    file: 'task-08-delegate',
    title: 'delegate',
    description: 'Return a function that calls obj[method] with preserved this.',
    exportName: 'delegate',
    params: 'obj, method',
    sig: '',
    solution: `export function delegate(obj, method) {
  const fn = obj[method];
  if (typeof fn !== 'function') throw new TypeError('Not a method');
  return (...args) => fn.apply(obj, args);
}`,
    test: `const o = { x: 1, inc() { this.x++; return this.x; } };
const inc = delegate(o, 'inc');
assert(inc() === 2 && o.x === 2);`,
  },
  {
    file: 'task-09-create-bound-class',
    title: 'createBoundClass',
    description: 'Wrap class so all prototype methods are auto-bound on construction.',
    exportName: 'createBoundClass',
    params: 'Base',
    sig: '',
    solution: `export function createBoundClass(Base) {
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
}`,
    test: `class Counter { constructor() { this.n = 0; } tick() { return ++this.n; } }
const Bound = createBoundClass(Counter);
const c = new Bound();
const tick = c.tick;
assert(tick() === 1);`,
  },
];
