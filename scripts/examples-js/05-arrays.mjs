/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  { num: 81, slug: 'map-polyfill', folder: '05-arrays', title: 'map polyfill', tags: ['arrays'], difficulty: 'easy', description: 'Array.prototype.map polyfill.', solution: `export function mapPolyfill(arr, fn, thisArg) {
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) out[i] = fn.call(thisArg, arr[i], i, arr);
  return out;
}`, test: `assert(mapPolyfill([1, 2], (x) => x * 2).join() === '2,4');` },
  { num: 82, slug: 'filter-polyfill', folder: '05-arrays', title: 'filter polyfill', tags: ['arrays'], difficulty: 'easy', description: 'Array.prototype.filter polyfill.', solution: `export function filterPolyfill(arr, pred, thisArg) {
  const out = [];
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) out.push(arr[i]);
  return out;
}`, test: `assert(filterPolyfill([1, 2, 3], (x) => x > 1).join() === '2,3');` },
  { num: 83, slug: 'reduce-polyfill', folder: '05-arrays', title: 'reduce polyfill', tags: ['arrays'], difficulty: 'easy', description: 'Array.prototype.reduce polyfill.', solution: `export function reducePolyfill(arr, fn, initial) {
  let acc = initial;
  let start = 0;
  if (acc === undefined) { acc = arr[0]; start = 1; }
  for (let i = start; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}`, test: `assert(reducePolyfill([1, 2, 3], (a, b) => a + b, 0) === 6);` },
  { num: 84, slug: 'flat', folder: '05-arrays', title: 'flat', tags: ['arrays'], difficulty: 'easy', description: 'flatten массив с depth.', solution: `export function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flat(v, depth - 1) : v), []);
}`, test: `assert(flat([1, [2, [3]]], 2).join() === '1,2,3');` },
  { num: 85, slug: 'flat-map', folder: '05-arrays', title: 'flatMap', tags: ['arrays'], difficulty: 'easy', description: 'map + flat(1).', solution: `export function flatMap(arr, fn) {
  return arr.map(fn).flat(1);
}`, test: `assert(flatMap([1, 2], (x) => [x, x]).join() === '1,1,2,2');` },
  { num: 86, slug: 'chunk', folder: '05-arrays', title: 'chunk', tags: ['arrays'], difficulty: 'easy', description: 'Разбей массив на куски size.', solution: `export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}`, test: `assert(chunk([1, 2, 3, 4], 2).length === 2);` },
  { num: 87, slug: 'compact', folder: '05-arrays', title: 'compact', tags: ['arrays'], difficulty: 'easy', description: 'Убери falsy значения.', solution: `export function compact(arr) {
  return arr.filter(Boolean);
}`, test: `assert(compact([0, 1, '', 2]).join() === '1,2');` },
  { num: 88, slug: 'uniq', folder: '05-arrays', title: 'uniq', tags: ['arrays'], difficulty: 'easy', description: 'Уникальные значения.', solution: `export function uniq(arr) {
  return [...new Set(arr)];
}`, test: `assert(uniq([1, 1, 2]).join() === '1,2');` },
  { num: 89, slug: 'uniq-by', folder: '05-arrays', title: 'uniq by', tags: ['arrays'], difficulty: 'medium', description: 'uniq по iteratee(x).', solution: `export function uniqBy(arr, iteratee) {
  const seen = new Set();
  const keyFn = typeof iteratee === 'function' ? iteratee : (x) => x[iteratee];
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}`, test: `assert(uniqBy([{ id: 1 }, { id: 1 }, { id: 2 }], (x) => x.id).length === 2);` },
  { num: 90, slug: 'group-by', folder: '05-arrays', title: 'groupBy', tags: ['arrays'], difficulty: 'easy', description: 'groupBy(arr, keyFn).', solution: `export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}`, test: `const g = groupBy([1, 2, 3], (x) => x % 2);
assert(g[1].length === 2);` },
  { num: 91, slug: 'partition', folder: '05-arrays', title: 'partition', tags: ['arrays'], difficulty: 'easy', description: 'partition по предикату: [pass, fail].', solution: `export function partition(arr, pred) {
  const pass = [];
  const fail = [];
  for (const item of arr) (pred(item) ? pass : fail).push(item);
  return [pass, fail];
}`, test: `const [a, b] = partition([1, 2, 3], (x) => x > 1);
assert(a.join() === '2,3' && b.join() === '1');` },
  { num: 92, slug: 'intersection', folder: '05-arrays', title: 'intersection', tags: ['arrays'], difficulty: 'easy', description: 'Пересечение массивов.', solution: `export function intersection(...arrays) {
  if (!arrays.length) return [];
  const [first, ...rest] = arrays;
  const sets = rest.map((a) => new Set(a));
  return first.filter((x) => sets.every((s) => s.has(x)));
}`, test: `assert(intersection([1, 2], [2, 3]).join() === '2');` },
  { num: 93, slug: 'union', folder: '05-arrays', title: 'union', tags: ['arrays'], difficulty: 'easy', description: 'Объединение без дубликатов.', solution: `export function union(...arrays) {
  return [...new Set(arrays.flat())];
}`, test: `assert(union([1, 2], [2, 3]).sort().join() === '1,2,3');` },
  { num: 94, slug: 'difference', folder: '05-arrays', title: 'difference', tags: ['arrays'], difficulty: 'easy', description: 'Элементы a, которых нет в b.', solution: `export function difference(a, b) {
  const set = new Set(b);
  return a.filter((x) => !set.has(x));
}`, test: `assert(difference([1, 2, 3], [2]).join() === '1,3');` },
  { num: 95, slug: 'zip', folder: '05-arrays', title: 'zip', tags: ['arrays'], difficulty: 'easy', description: 'zip(...arrays): кортежи по индексу.', solution: `export function zip(...arrays) {
  const len = Math.min(...arrays.map((a) => a.length));
  return Array.from({ length: len }, (_, i) => arrays.map((a) => a[i]));
}`, test: `assert(zip([1, 2], ['a', 'b'])[0].join() === '1,a');` },
  { num: 96, slug: 'unzip', folder: '05-arrays', title: 'unzip', tags: ['arrays'], difficulty: 'easy', description: 'unzip: обратно к столбцам.', solution: `export function unzip(rows) {
  return rows[0].map((_, i) => rows.map((row) => row[i]));
}`, test: `assert(unzip([[1, 'a'], [2, 'b']])[0].join() === '1,2');` },
  { num: 97, slug: 'take', folder: '05-arrays', title: 'take', tags: ['arrays'], difficulty: 'easy', description: 'Первые n элементов.', solution: `export function take(arr, n) {
  return arr.slice(0, n);
}`, test: `assert(take([1, 2, 3], 2).join() === '1,2');` },
  { num: 98, slug: 'drop', folder: '05-arrays', title: 'drop', tags: ['arrays'], difficulty: 'easy', description: 'Пропустить n элементов.', solution: `export function drop(arr, n) {
  return arr.slice(n);
}`, test: `assert(drop([1, 2, 3], 1).join() === '2,3');` },
  { num: 99, slug: 'find-last', folder: '05-arrays', title: 'findLast', tags: ['arrays'], difficulty: 'easy', description: 'findLast: последний по предикату.', solution: `export function findLast(arr, pred) {
  for (let i = arr.length - 1; i >= 0; i--) if (pred(arr[i], i, arr)) return arr[i];
  return undefined;
}`, test: `assert(findLast([1, 2, 3, 2], (x) => x === 2) === 2);` },
  { num: 100, slug: 'rotate', folder: '05-arrays', title: 'rotate', tags: ['arrays'], difficulty: 'easy', description: 'rotate(arr, k): сдвиг вправо.', solution: `export function rotate(arr, k) {
  const n = arr.length;
  if (!n) return [];
  const shift = ((k % n) + n) % n;
  return [...arr.slice(-shift), ...arr.slice(0, -shift)];
}`, test: `assert(rotate([1, 2, 3], 1).join() === '3,1,2');` },
  { num: 101, slug: 'shuffle', folder: '05-arrays', title: 'shuffle', tags: ['arrays'], difficulty: 'medium', description: 'Fisher–Yates shuffle (копия).', solution: `export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}`, test: `const s = shuffle([1, 2, 3]);
assert(s.sort().join() === '1,2,3');` },
  { num: 102, slug: 'sample', folder: '05-arrays', title: 'sample', tags: ['arrays'], difficulty: 'easy', description: 'Случайный элемент массива.', solution: `export function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}`, test: `assert([1, 2, 3].includes(sample([1, 2, 3])));` },
  { num: 103, slug: 'range', folder: '05-arrays', title: 'range', tags: ['arrays'], difficulty: 'easy', description: 'range(start, end, step).', solution: `export function range(start, end, step = 1) {
  const out = [];
  if (step > 0) for (let i = start; i < end; i += step) out.push(i);
  else for (let i = start; i > end; i += step) out.push(i);
  return out;
}`, test: `assert(range(0, 5).join() === '0,1,2,3,4');` },
  { num: 104, slug: 'sum-by', folder: '05-arrays', title: 'sumBy', tags: ['arrays'], difficulty: 'easy', description: 'sumBy(arr, iteratee).', solution: `export function sumBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (x) => x[iteratee];
  return arr.reduce((s, x) => s + fn(x), 0);
}`, test: `assert(sumBy([{ v: 1 }, { v: 2 }], (x) => x.v) === 3);` },
  { num: 105, slug: 'sort-by', folder: '05-arrays', title: 'sortBy', tags: ['arrays'], difficulty: 'medium', description: 'Стабильная сортировка по ключу.', solution: `export function sortBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (x) => x[iteratee];
  return arr
    .map((item, index) => ({ item, index, key: fn(item) }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : a.index - b.index))
    .map((x) => x.item);
}`, test: `assert(sortBy([{ n: 2 }, { n: 1 }], (x) => x.n)[0].n === 1);` },
];
