/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 1,
    slug: 'typeof-detailed',
    folder: '01-types',
    title: 'typeof detailed',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Верни расширенный type tag: null, array, date, иначе typeof.',
    solution: `export function typeofDetailed(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  return typeof value;
}`,
    test: `assert(typeofDetailed(null) === 'null');
assert(typeofDetailed([]) === 'array');
assert(typeofDetailed(new Date()) === 'date');
assert(typeofDetailed(42) === 'number');`,
  },
  {
    num: 2,
    slug: 'is-primitive',
    folder: '01-types',
    title: 'is primitive',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Проверь, является ли значение примитивом.',
    solution: `export function isPrimitive(value) {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}`,
    test: `assert(isPrimitive(1) === true);
assert(isPrimitive('a') === true);
assert(isPrimitive(null) === true);
assert(isPrimitive({}) === false);`,
  },
  {
    num: 3,
    slug: 'is-plain-object',
    folder: '01-types',
    title: 'is plain object',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Plain object: создан через {} или Object.create(null), не массив/Date/class.',
    solution: `export function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}`,
    test: `assert(isPlainObject({}) === true);
assert(isPlainObject(Object.create(null)) === true);
assert(isPlainObject([]) === false);
assert(isPlainObject(new Date()) === false);`,
  },
  {
    num: 4,
    slug: 'loose-equal',
    folder: '01-types',
    title: 'loose equal',
    tags: ['types', 'coercion'],
    difficulty: 'medium',
    description: 'Реализуй == без использования оператора ==.',
    solution: `export function looseEqual(a, b) {
  if (a === b) return true;
  if (a === null && b === undefined) return true;
  if (a === undefined && b === null) return true;
  if (a == null || b == null) return a === b;
  const ta = typeof a;
  const tb = typeof b;
  if (ta === 'number' || tb === 'number') {
    return Number(a) === Number(b);
  }
  if (ta === 'string' || tb === 'string') {
    return String(a) === String(b);
  }
  if (ta === 'boolean' || tb === 'boolean') {
    return Number(a) === Number(b);
  }
  if (ta === 'object' && tb === 'object') {
    return false;
  }
  return false;
}`,
    test: `assert(looseEqual(1, '1') === true);
assert(looseEqual(null, undefined) === true);
assert(looseEqual(0, false) === true);
assert(looseEqual({}, {}) === false);`,
  },
  {
    num: 5,
    slug: 'strict-equal',
    folder: '01-types',
    title: 'strict equal',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Реализуй === без использования ===.',
    solution: `export function strictEqual(a, b) {
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null) return Object.is(a, b);
  if (a === b) return true;
  return false;
}`,
    test: `assert(strictEqual(1, 1) === true);
assert(strictEqual(1, '1') === false);
assert(strictEqual(NaN, NaN) === true);
assert(strictEqual({}, {}) === false);`,
  },
  {
    num: 6,
    slug: 'shallow-equal',
    folder: '01-types',
    title: 'shallow equal',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Поверхностное сравнение объектов и массивов.',
    solution: `export function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}`,
    test: `assert(shallowEqual({ a: 1 }, { a: 1 }) === true);
assert(shallowEqual({ a: { x: 1 } }, { a: { x: 1 } }) === false);
assert(shallowEqual([1, 2], [1, 2]) === true);`,
  },
  {
    num: 7,
    slug: 'deep-equal',
    folder: '01-types',
    title: 'deep equal',
    tags: ['types'],
    difficulty: 'medium',
    description: 'Глубокое сравнение объектов и массивов (без циклов).',
    solution: `export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}`,
    test: `assert(deepEqual({ a: { b: 1 } }, { a: { b: 1 } }) === true);
assert(deepEqual([1, [2]], [1, [2]]) === true);
assert(deepEqual({ a: 1 }, { a: 2 }) === false);`,
  },
  {
    num: 8,
    slug: 'coerce-number',
    folder: '01-types',
    title: 'coerce number',
    tags: ['types', 'coercion'],
    difficulty: 'easy',
    description: 'Безопасно приведи к числу; NaN → null.',
    solution: `export function coerceNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}`,
    test: `assert(coerceNumber('42') === 42);
assert(coerceNumber('x') === null);
assert(coerceNumber('') === null);`,
  },
  {
    num: 9,
    slug: 'coerce-string',
    folder: '01-types',
    title: 'coerce string',
    tags: ['types', 'coercion'],
    difficulty: 'easy',
    description: 'Предсказуемое приведение к строке (null/undefined → "").',
    solution: `export function coerceString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}`,
    test: `assert(coerceString(null) === '');
assert(coerceString(42) === '42');
assert(coerceString(false) === 'false');`,
  },
  {
    num: 10,
    slug: 'to-boolean',
    folder: '01-types',
    title: 'to boolean',
    tags: ['types', 'coercion'],
    difficulty: 'easy',
    description: 'Явное приведение к boolean по правилам JS.',
    solution: `export function toBoolean(value) {
  return Boolean(value);
}`,
    test: `assert(toBoolean(0) === false);
assert(toBoolean('') === false);
assert(toBoolean('0') === true);
assert(toBoolean([]) === true);`,
  },
  {
    num: 11,
    slug: 'safe-json-parse',
    folder: '01-types',
    title: 'safe json parse',
    tags: ['types'],
    difficulty: 'easy',
    description: 'JSON.parse с fallback при ошибке.',
    solution: `export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}`,
    test: `assert(safeJsonParse('{"a":1}').a === 1);
assert(safeJsonParse('{bad}', 0) === 0);`,
  },
  {
    num: 12,
    slug: 'compare-versions',
    folder: '01-types',
    title: 'compare versions',
    tags: ['types'],
    difficulty: 'medium',
    description: 'Сравни semver: -1 | 0 | 1.',
    solution: `export function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da < db) return -1;
    if (da > db) return 1;
  }
  return 0;
}`,
    test: `assert(compareVersions('1.2.3', '1.10.0') === -1);
assert(compareVersions('2.0.0', '2.0.0') === 0);
assert(compareVersions('3.0.1', '3.0.0') === 1);`,
  },
  {
    num: 13,
    slug: 'shallow-clone',
    folder: '01-types',
    title: 'shallow clone',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Поверхностное копирование объекта или массива.',
    solution: `export function shallowClone(value) {
  if (Array.isArray(value)) return [...value];
  if (value !== null && typeof value === 'object') return { ...value };
  return value;
}`,
    test: `const o = { a: 1 };
const c = shallowClone(o);
assert(c !== o && c.a === 1);
const arr = [1, 2];
assert(shallowClone(arr).join() === '1,2');`,
  },
  {
    num: 14,
    slug: 'deep-clone-json',
    folder: '01-types',
    title: 'deep clone json',
    tags: ['types'],
    difficulty: 'easy',
    description: 'Deep clone через JSON (только JSON-типы).',
    solution: `export function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}`,
    test: `const o = { a: { b: 1 } };
const c = deepCloneJson(o);
c.a.b = 2;
assert(o.a.b === 1);`,
  },
  {
    num: 15,
    slug: 'deep-clone',
    folder: '01-types',
    title: 'deep clone',
    tags: ['types'],
    difficulty: 'medium',
    description: 'Deep clone объектов/массивов/Date (lite, без циклов).',
    solution: `export function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const key of Object.keys(value)) {
    out[key] = deepClone(value[key]);
  }
  return out;
}`,
    test: `const d = new Date('2020-01-01');
const o = { a: [1], d };
const c = deepClone(o);
assert(c !== o && c.a !== o.a);
assert(c.d.getTime() === d.getTime());`,
  },
];
