/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 41, slug: 'my-call', folder: '03-this-prototypes', title: 'my call', tags: ['this'], difficulty: 'medium',
    description: 'Реализуй Function.prototype.call.',
    solution: `export function myCall(fn, thisArg, ...args) {
  return fn.apply(thisArg, args);
}`,
    test: `assert(myCall((a, b) => a + b, null, 1, 2) === 3);`,
  },
  {
    num: 42, slug: 'my-apply', folder: '03-this-prototypes', title: 'my apply', tags: ['this'], difficulty: 'medium',
    description: 'Реализуй Function.prototype.apply.',
    solution: `export function myApply(fn, thisArg, args = []) {
  return fn.apply(thisArg, args);
}`,
    test: `assert(myApply((a, b) => a + b, null, [1, 2]) === 3);`,
  },
  {
    num: 43, slug: 'my-bind', folder: '03-this-prototypes', title: 'my bind', tags: ['this'], difficulty: 'medium',
    description: 'Реализуй Function.prototype.bind.',
    solution: `export function myBind(fn, thisArg, ...bound) {
  return function (...args) {
    return fn.apply(thisArg, [...bound, ...args]);
  };
}`,
    test: `const add = myBind((a, b) => a + b, null, 1);
assert(add(2) === 3);`,
  },
  {
    num: 44, slug: 'my-new', folder: '03-this-prototypes', title: 'my new', tags: ['this'], difficulty: 'medium',
    description: 'Реализуй оператор new.',
    solution: `export function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result !== null && typeof result === 'object' ? result : obj;
}`,
    test: `function Person(name) { this.name = name; }
Person.prototype.greet = function () { return this.name; };
const p = myNew(Person, 'Ann');
assert(p.name === 'Ann' && p.greet() === 'Ann');`,
  },
  {
    num: 45, slug: 'instanceof-polyfill', folder: '03-this-prototypes', title: 'instanceof polyfill', tags: ['prototypes'], difficulty: 'medium',
    description: 'instanceof без instanceof.',
    solution: `export function instanceofPolyfill(obj, Constructor) {
  if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`,
    test: `assert(instanceofPolyfill([], Array) === true);
assert(instanceofPolyfill({}, Array) === false);`,
  },
  {
    num: 46, slug: 'object-create', folder: '03-this-prototypes', title: 'object create', tags: ['prototypes'], difficulty: 'easy',
    description: 'Object.create(proto): объект с заданным прототипом.',
    solution: `export function objectCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}`,
    test: `const o = objectCreate({ x: 1 });
assert(o.x === 1);`,
  },
  {
    num: 47, slug: 'prototype-chain', folder: '03-this-prototypes', title: 'prototype chain', tags: ['prototypes'], difficulty: 'easy',
    description: 'Верни массив прототипов от obj до null.',
    solution: `export function prototypeChain(obj) {
  const chain = [];
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}`,
    test: `assert(prototypeChain({}).length >= 1);`,
  },
  {
    num: 48, slug: 'mixin', folder: '03-this-prototypes', title: 'mixin', tags: ['prototypes'], difficulty: 'easy',
    description: 'mixin(target, ...sources): скопируй enumerable свойства.',
    solution: `export function mixin(target, ...sources) {
  for (const src of sources) {
    Object.assign(target, src);
  }
  return target;
}`,
    test: `const t = {};
mixin(t, { a: 1 }, { b: 2 });
assert(t.a === 1 && t.b === 2);`,
  },
  {
    num: 49, slug: 'inherits-es5', folder: '03-this-prototypes', title: 'inherits es5', tags: ['prototypes'], difficulty: 'medium',
    description: 'inherits(Child, Parent): ES5 наследование.',
    solution: `export function inherits(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}`,
    test: `function A() {}
function B() {}
inherits(B, A);
assert(Object.getPrototypeOf(B.prototype) === A.prototype);`,
  },
  {
    num: 50, slug: 'extend-static', folder: '03-this-prototypes', title: 'extend static', tags: ['prototypes'], difficulty: 'easy',
    description: 'extendStatic(ctor, props): статические поля на конструктор.',
    solution: `export function extendStatic(ctor, props) {
  Object.assign(ctor, props);
  return ctor;
}`,
    test: `function C() {}
extendStatic(C, { version: 1 });
assert(C.version === 1);`,
  },
  {
    num: 51, slug: 'create-instance', folder: '03-this-prototypes', title: 'create instance', tags: ['prototypes'], difficulty: 'easy',
    description: 'createInstance(Constructor, ...args) без оператора new.',
    solution: `export function createInstance(Constructor, ...args) {
  return myNew(Constructor, ...args);
}

function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result !== null && typeof result === 'object' ? result : obj;
}`,
    test: `function Box(v) { this.v = v; }
const b = createInstance(Box, 5);
assert(b.v === 5);`,
  },
  {
    num: 52, slug: 'get-all-keys', folder: '03-this-prototypes', title: 'get all keys', tags: ['prototypes'], difficulty: 'medium',
    description: 'Все ключи: own + inherited enumerable.',
    solution: `export function getAllKeys(obj) {
  const keys = new Set();
  let current = obj;
  while (current && current !== Object.prototype) {
    Object.keys(current).forEach((k) => keys.add(k));
    current = Object.getPrototypeOf(current);
  }
  return [...keys];
}`,
    test: `const o = Object.create({ inherited: 1 });
o.own = 2;
const keys = getAllKeys(o);
assert(keys.includes('own') && keys.includes('inherited'));`,
  },
  {
    num: 53, slug: 'has-own', folder: '03-this-prototypes', title: 'has own', tags: ['prototypes'], difficulty: 'easy',
    description: 'Безопасный hasOwnProperty.',
    solution: `export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
    test: `const o = Object.create({ a: 1 });
o.b = 2;
assert(hasOwn(o, 'b') === true);
assert(hasOwn(o, 'a') === false);`,
  },
  {
    num: 54, slug: 'define-property-safe', folder: '03-this-prototypes', title: 'define property safe', tags: ['prototypes'], difficulty: 'medium',
    description: 'definePropertySafe с дефолтами enumerable/writable/configurable.',
    solution: `export function definePropertySafe(obj, key, descriptor) {
  const defaults = { enumerable: false, writable: false, configurable: false };
  return Object.defineProperty(obj, key, { ...defaults, ...descriptor });
}`,
    test: `const o = {};
definePropertySafe(o, 'x', { value: 1, enumerable: true });
assert(o.x === 1);`,
  },
  {
    num: 55, slug: 'property-descriptor', folder: '03-this-prototypes', title: 'property descriptor', tags: ['prototypes'], difficulty: 'easy',
    description: 'Получи descriptor свойства или null.',
    solution: `export function propertyDescriptor(obj, key) {
  return Object.getOwnPropertyDescriptor(obj, key) ?? null;
}`,
    test: `const d = propertyDescriptor({ a: 1 }, 'a');
assert(d && d.value === 1);`,
  },
];
