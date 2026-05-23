/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  { num: 151, slug: 'array-find', folder: '09-polyfills', title: 'array find', tags: ['polyfills'], difficulty: 'easy', description: 'Array.prototype.find polyfill.', solution: `export function arrayFind(arr, pred, thisArg) {
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) return arr[i];
  return undefined;
}`, test: `assert(arrayFind([1, 2, 3], (x) => x > 1) === 2);` },
  { num: 152, slug: 'array-find-index', folder: '09-polyfills', title: 'array findIndex', tags: ['polyfills'], difficulty: 'easy', description: 'findIndex polyfill.', solution: `export function arrayFindIndex(arr, pred, thisArg) {
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) return i;
  return -1;
}`, test: `assert(arrayFindIndex([1, 2, 3], (x) => x === 2) === 1);` },
  { num: 153, slug: 'array-includes', folder: '09-polyfills', title: 'array includes', tags: ['polyfills'], difficulty: 'easy', description: 'includes polyfill.', solution: `export function arrayIncludes(arr, value, fromIndex = 0) {
  const start = fromIndex < 0 ? Math.max(0, arr.length + fromIndex) : fromIndex;
  for (let i = start; i < arr.length; i++) if (Object.is(arr[i], value)) return true;
  return false;
}`, test: `assert(arrayIncludes([1, 2], 2) === true);` },
  { num: 154, slug: 'array-at', folder: '09-polyfills', title: 'array at', tags: ['polyfills'], difficulty: 'easy', description: 'at(index) polyfill.', solution: `export function arrayAt(arr, index) {
  const i = index < 0 ? arr.length + index : index;
  return arr[i];
}`, test: `assert(arrayAt([1, 2, 3], -1) === 3);` },
  { num: 155, slug: 'string-includes', folder: '09-polyfills', title: 'string includes', tags: ['polyfills'], difficulty: 'easy', description: 'String.includes polyfill.', solution: `export function stringIncludes(str, search, pos = 0) {
  return str.indexOf(search, pos) !== -1;
}`, test: `assert(stringIncludes('hello', 'ell') === true);` },
  { num: 156, slug: 'string-starts-ends', folder: '09-polyfills', title: 'string starts ends', tags: ['polyfills'], difficulty: 'easy', description: 'startsWith / endsWith.', solution: `export function stringStartsWith(str, search, pos = 0) {
  return str.slice(pos, pos + search.length) === search;
}

export function stringEndsWith(str, search) {
  return str.slice(-search.length) === search;
}`, test: `assert(stringStartsWith('abc', 'ab') === true);
assert(stringEndsWith('abc', 'bc') === true);` },
  { num: 157, slug: 'object-assign', folder: '09-polyfills', title: 'object assign', tags: ['polyfills'], difficulty: 'easy', description: 'Object.assign polyfill.', solution: `export function objectAssign(target, ...sources) {
  for (const src of sources) {
    if (src == null) continue;
    for (const key of Object.keys(src)) target[key] = src[key];
  }
  return target;
}`, test: `const o = objectAssign({}, { a: 1 });
assert(o.a === 1);` },
  { num: 158, slug: 'object-entries', folder: '09-polyfills', title: 'object entries', tags: ['polyfills'], difficulty: 'easy', description: 'Object.entries / values.', solution: `export function objectEntries(obj) {
  return Object.keys(obj).map((k) => [k, obj[k]]);
}

export function objectValues(obj) {
  return objectEntries(obj).map(([, v]) => v);
}`, test: `assert(objectEntries({ a: 1 })[0][1] === 1);
assert(objectValues({ a: 1 })[0] === 1);` },
  { num: 159, slug: 'object-from-entries', folder: '09-polyfills', title: 'object fromEntries', tags: ['polyfills'], difficulty: 'easy', description: 'Object.fromEntries polyfill.', solution: `export function objectFromEntries(entries) {
  const o = {};
  for (const [k, v] of entries) o[k] = v;
  return o;
}`, test: `assert(objectFromEntries([['a', 1]]).a === 1);` },
  { num: 160, slug: 'function-bind-polyfill', folder: '09-polyfills', title: 'function bind polyfill', tags: ['polyfills'], difficulty: 'medium', description: 'bind polyfill.', solution: `export function functionBind(fn, thisArg, ...bound) {
  return (...args) => fn.apply(thisArg, [...bound, ...args]);
}`, test: `const f = functionBind((a, b) => a + b, null, 1);
assert(f(2) === 3);` },
  { num: 161, slug: 'promise-finally', folder: '09-polyfills', title: 'promise finally', tags: ['polyfills'], difficulty: 'medium', description: 'promiseFinally(p, onFinally).', solution: `export function promiseFinally(promise, onFinally) {
  return promise.then(
    (v) => Promise.resolve(onFinally()).then(() => v),
    (e) => Promise.resolve(onFinally()).then(() => { throw e; }),
  );
}`, test: `let d = 0;
await promiseFinally(Promise.resolve(1), () => { d = 1; });
assert(d === 1);`, runAsync: true },
  { num: 162, slug: 'structured-clone-lite', folder: '09-polyfills', title: 'structured clone lite', tags: ['polyfills'], difficulty: 'medium', description: 'structuredClone lite (JSON types + Date).', solution: `export function structuredCloneLite(value) {
  if (value instanceof Date) return new Date(value.getTime());
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(structuredCloneLite);
  const out = {};
  for (const k of Object.keys(value)) out[k] = structuredCloneLite(value[k]);
  return out;
}`, test: `const o = { d: new Date('2020-01-01') };
const c = structuredCloneLite(o);
assert(c.d.getTime() === o.d.getTime());` },
  { num: 163, slug: 'json-stringify-safe', folder: '09-polyfills', title: 'json stringify safe', tags: ['polyfills'], difficulty: 'medium', description: 'JSON.stringify с circular ref.', solution: `export function jsonStringifySafe(value) {
  const seen = new WeakSet();
  return JSON.stringify(value, (key, val) => {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) return '[Circular]';
      seen.add(val);
    }
    return val;
  });
}`, test: `const o = {}; o.self = o;
assert(jsonStringifySafe(o).includes('[Circular]'));` },
  { num: 164, slug: 'number-is-finite', folder: '09-polyfills', title: 'number isFinite', tags: ['polyfills'], difficulty: 'easy', description: 'Number.isFinite polyfill.', solution: `export function numberIsFinite(value) {
  return typeof value === 'number' && isFinite(value);
}`, test: `assert(numberIsFinite(1) === true);
assert(numberIsFinite('1') === false);` },
  { num: 165, slug: 'global-this', folder: '09-polyfills', title: 'globalThis', tags: ['polyfills'], difficulty: 'easy', description: 'getGlobalThis().', solution: `export function getGlobalThis() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  return Function('return this')();
}`, test: `assert(getGlobalThis() != null);` },
];
