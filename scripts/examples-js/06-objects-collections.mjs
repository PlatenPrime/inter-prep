/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  { num: 106, slug: 'pick', folder: '06-objects-collections', title: 'pick', tags: ['objects'], difficulty: 'easy', description: 'pick(obj, keys).', solution: `export function pick(obj, keys) {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});
}`, test: `assert(pick({ a: 1, b: 2 }, ['a']).a === 1);` },
  { num: 107, slug: 'omit', folder: '06-objects-collections', title: 'omit', tags: ['objects'], difficulty: 'easy', description: 'omit(obj, keys).', solution: `export function omit(obj, keys) {
  const set = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !set.has(k)));
}`, test: `assert(omit({ a: 1, b: 2 }, ['b']).a === 1 && !('b' in omit({ a: 1, b: 2 }, ['b'])));` },
  { num: 108, slug: 'merge', folder: '06-objects-collections', title: 'merge', tags: ['objects'], difficulty: 'easy', description: 'shallow merge объектов.', solution: `export function merge(...objects) {
  return Object.assign({}, ...objects);
}`, test: `assert(merge({ a: 1 }, { b: 2 }).a === 1);` },
  { num: 109, slug: 'deep-merge', folder: '06-objects-collections', title: 'deep merge', tags: ['objects'], difficulty: 'medium', description: 'deep merge вложенных объектов.', solution: `export function deepMerge(target, ...sources) {
  for (const src of sources) {
    for (const key of Object.keys(src)) {
      const tv = target[key];
      const sv = src[key];
      if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
        deepMerge(tv, sv);
      } else {
        target[key] = sv;
      }
    }
  }
  return target;
}`, test: `const o = deepMerge({ a: { x: 1 } }, { a: { y: 2 } });
assert(o.a.x === 1 && o.a.y === 2);` },
  { num: 110, slug: 'defaults', folder: '06-objects-collections', title: 'defaults', tags: ['objects'], difficulty: 'easy', description: 'defaults(obj, defs): только отсутствующие ключи.', solution: `export function defaults(obj, defs) {
  const out = { ...obj };
  for (const [k, v] of Object.entries(defs)) {
    if (out[k] === undefined) out[k] = v;
  }
  return out;
}`, test: `assert(defaults({ a: 1 }, { a: 0, b: 2 }).b === 2);` },
  { num: 111, slug: 'get-path', folder: '06-objects-collections', title: 'get path', tags: ['objects'], difficulty: 'easy', description: "get(obj, 'a.b.c', default).", solution: `export function getPath(obj, path, defaultValue) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return defaultValue;
    cur = cur[k];
  }
  return cur === undefined ? defaultValue : cur;
}`, test: `assert(getPath({ a: { b: 1 } }, 'a.b') === 1);` },
  { num: 112, slug: 'set-path', folder: '06-objects-collections', title: 'set path', tags: ['objects'], difficulty: 'medium', description: "set(obj, 'a.b', value).", solution: `export function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}`, test: `const o = {};
setPath(o, 'a.b', 1);
assert(o.a.b === 1);` },
  { num: 113, slug: 'has-path', folder: '06-objects-collections', title: 'has path', tags: ['objects'], difficulty: 'easy', description: 'hasPath(obj, path).', solution: `export function hasPath(obj, path) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null || !(k in cur)) return false;
    cur = cur[k];
  }
  return true;
}`, test: `assert(hasPath({ a: { b: 1 } }, 'a.b') === true);` },
  { num: 114, slug: 'flatten-object', folder: '06-objects-collections', title: 'flatten object', tags: ['objects'], difficulty: 'medium', description: 'flatten({ a: { b: 1 } }) → { "a.b": 1 }.', solution: `export function flattenObject(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? \`\${prefix}.\${k}\` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flattenObject(v, key));
    else out[key] = v;
  }
  return out;
}`, test: `assert(flattenObject({ a: { b: 1 } })['a.b'] === 1);` },
  { num: 115, slug: 'unflatten-object', folder: '06-objects-collections', title: 'unflatten object', tags: ['objects'], difficulty: 'medium', description: 'unflatten dotted keys.', solution: `export function unflattenObject(flat) {
  const out = {};
  for (const [path, value] of Object.entries(flat)) setPath(out, path, value);
  return out;
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!cur[k]) cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}`, test: `assert(unflattenObject({ 'a.b': 1 }).a.b === 1);` },
  { num: 116, slug: 'invert', folder: '06-objects-collections', title: 'invert', tags: ['objects'], difficulty: 'easy', description: 'invert: ключ ↔ значение.', solution: `export function invert(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}`, test: `assert(invert({ a: '1' })['1'] === 'a');` },
  { num: 117, slug: 'map-keys', folder: '06-objects-collections', title: 'mapKeys', tags: ['objects'], difficulty: 'easy', description: 'mapKeys(obj, fn).', solution: `export function mapKeys(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k, v), v]));
}`, test: `assert(mapKeys({ a: 1 }, (k) => k.toUpperCase()).A === 1);` },
  { num: 118, slug: 'map-values', folder: '06-objects-collections', title: 'mapValues', tags: ['objects'], difficulty: 'easy', description: 'mapValues(obj, fn).', solution: `export function mapValues(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));
}`, test: `assert(mapValues({ a: 1 }, (v) => v * 2).a === 2);` },
  { num: 119, slug: 'from-entries', folder: '06-objects-collections', title: 'fromEntries', tags: ['objects'], difficulty: 'easy', description: 'Object.fromEntries polyfill.', solution: `export function fromEntries(entries) {
  const obj = {};
  for (const [k, v] of entries) obj[k] = v;
  return obj;
}`, test: `assert(fromEntries([['a', 1]]).a === 1);` },
  { num: 120, slug: 'count-by', folder: '06-objects-collections', title: 'countBy', tags: ['objects'], difficulty: 'easy', description: 'countBy(arr, keyFn).', solution: `export function countBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}`, test: `assert(countBy(['a', 'b', 'a'], (x) => x).a === 2);` },
];
