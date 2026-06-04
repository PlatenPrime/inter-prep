/**
 * 100 JS interview tasks (001–100), ordered easy → middle.
 * Source tasks from examples-js catalogs; solutions stay in defs for generator verify only.
 */
import { tasks as t01 } from './examples-js/01-types.mjs';
import { tasks as t02 } from './examples-js/02-functions-closures.mjs';
import { tasks as t03 } from './examples-js/03-this-prototypes.mjs';
import { tasks as t04 } from './examples-js/04-async-promises.mjs';
import { tasks as t05 } from './examples-js/05-arrays.mjs';
import { tasks as t06 } from './examples-js/06-objects-collections.mjs';
import { tasks as t07 } from './examples-js/07-strings.mjs';
import { tasks as t08 } from './examples-js/08-dom-events.mjs';
import { tasks as t09 } from './examples-js/09-polyfills.mjs';
import { tasks as t10 } from './examples-js/10-algorithms-easy.mjs';
import { tasks as t11 } from './examples-js/11-patterns-practices.mjs';
import { getExplanation } from './js-tasks-explanations.mjs';
import { padNum } from './js-tasks-template.mjs';

const catalog = new Map(
  [...t01, ...t02, ...t03, ...t04, ...t05, ...t06, ...t07, ...t08, ...t09, ...t10, ...t11].map(
    (t) => [t.num, t],
  ),
);

/** Example nums in difficulty order (001 = easiest). */
export const TASK_ORDER = [
  // 001–020: types, strings, arrays
  2, 1, 3, 10, 8, 9, 11, 13, 169, 174, 166, 133, 135, 121, 126, 87, 88, 103, 170, 168,
  // 021–040: closures & functions
  16, 17, 23, 26, 27, 28, 29, 30, 25, 39, 38, 19, 21, 18, 24, 20, 22, 31, 32, 33,
  // 041–060: prototypes, polyfills, objects
  41, 42, 43, 45, 46, 53, 106, 107, 108, 111, 109, 81, 82, 83, 151, 84, 90, 120, 110, 112,
  // 061–080: async
  56, 57, 58, 59, 61, 60, 62, 63, 64, 65, 66, 67, 70, 71, 73, 75, 78, 74, 72, 80,
  // 081–100: arrays utils, algorithms, patterns
  86, 171, 173, 176, 172, 177, 178, 180, 190, 139, 199, 179, 181, 183, 184, 194, 196, 197, 198, 200,
];

const TITLE_RU = {
  'is primitive': 'Примитив ли значение',
  'typeof detailed': 'Расширенный typeof',
  'is plain object': 'Plain object',
  'to boolean': 'Приведение к boolean',
  'coerce number': 'Безопасное число',
  'coerce string': 'Приведение к строке',
  'safe json parse': 'Безопасный JSON.parse',
  'shallow clone': 'Поверхностное клонирование',
  'sum array': 'Сумма массива',
  'reverse string': 'Разворот строки',
  fizzbuzz: 'FizzBuzz',
  'is palindrome': 'Палиндром',
  'count words': 'Подсчёт слов',
  capitalize: 'Capitalize',
  truncate: 'Обрезка строки',
  compact: 'Убрать falsy',
  uniq: 'Уникальные значения',
  range: 'range(start, end)',
  'max min': 'Максимум и минимум',
  factorial: 'Факториал',
  once: 'once',
  memoize: 'memoize',
  curry: 'curry',
  compose: 'compose',
  pipe: 'pipe',
  'create counter': 'Счётчик',
  'create stack': 'Стек',
  'create queue': 'Очередь',
  partial: 'partial',
  negate: 'negate',
  tap: 'tap',
  debounce: 'debounce',
  throttle: 'throttle',
  'memoize resolver': 'memoize с resolver',
  'curry auto': 'auto-curry',
  'debounce leading': 'debounce leading',
  'throttle trailing': 'throttle trailing',
  limiter: 'limiter',
  lazy: 'lazy',
  'retry sync': 'retrySync',
  'my call': 'myCall',
  'my apply': 'myApply',
  'my bind': 'myBind',
  'instanceof polyfill': 'instanceof',
  'object create': 'objectCreate',
  'has own': 'hasOwn',
  pick: 'pick',
  omit: 'omit',
  merge: 'merge',
  'get path': 'get по пути',
  'deep merge': 'deep merge',
  'map polyfill': 'map polyfill',
  'filter polyfill': 'filter polyfill',
  'reduce polyfill': 'reduce polyfill',
  'array find': 'find polyfill',
  flat: 'flat',
  groupBy: 'groupBy',
  countBy: 'countBy',
  defaults: 'defaults',
  'set path': 'set по пути',
  delay: 'delay',
  promisify: 'promisify',
  'promise all': 'Promise.all',
  'promise race': 'Promise.race',
  'promise any': 'Promise.any',
  'promise all settled': 'Promise.allSettled',
  sequence: 'sequence',
  'map limit': 'mapLimit',
  'retry async': 'retryAsync',
  'timeout promise': 'timeoutPromise',
  'cancelable promise': 'cancelablePromise',
  'sleep scheduler': 'sleep scheduler',
  pool: 'pool',
  mutex: 'mutex',
  poll: 'poll',
  'parallel map': 'parallel map',
  'async once': 'async once',
  'exponential backoff': 'exponential backoff',
  barrier: 'barrier',
  'settle first': 'settle first',
  chunk: 'chunk',
  'two sum': 'two sum',
  'valid parentheses': 'Скобки',
  'merge sorted': 'merge sorted',
  'binary search': 'binary search',
  'remove duplicates sorted': 'unique sorted',
  'missing number': 'missing number',
  'climbing stairs': 'climbing stairs',
  'lru cache': 'LRU cache',
  mitt: 'Event bus (mitt)',
  pipeline: 'pipeline',
  'majority element': 'majority element',
  'coin change min': 'coin change',
  'max subarray': 'max subarray',
  'contains duplicate': 'contains duplicate',
  strategy: 'strategy',
  adapter: 'adapter',
  'rate limiter': 'rate limiter',
  'circuit breaker': 'circuit breaker',
  'pub sub': 'pub/sub',
};

if (TASK_ORDER.length !== 100) {
  throw new Error(`TASK_ORDER must have 100 entries, got ${TASK_ORDER.length}`);
}

for (const n of TASK_ORDER) {
  if (!catalog.has(n)) throw new Error(`Missing catalog task #${n}`);
}

/** @returns {import('./js-tasks-template.mjs').JsTask[]} */
export function buildJsTasks() {
  return TASK_ORDER.map((sourceNum, index) => {
    const src = catalog.get(sourceNum);
    const num = index + 1;
    let difficulty = src.difficulty;
    if (num <= 25) difficulty = 'easy';
    else if (num >= 85) difficulty = 'medium';

    return {
      num,
      sourceNum,
      slug: src.slug,
      title: src.title,
      titleRu: TITLE_RU[src.title] ?? src.title,
      tags: src.tags,
      difficulty,
      description: src.description,
      solution: src.solution,
      test: src.test,
      runAsync: Boolean(src.runAsync),
      explanationRu: getExplanation(src.slug),
      label: `${padNum(num)}-${src.slug}`,
    };
  });
}

export const jsTasks = buildJsTasks();
