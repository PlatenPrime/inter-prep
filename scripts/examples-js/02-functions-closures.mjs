/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 16, slug: 'once', folder: '02-functions-closures', title: 'once', tags: ['closures'], difficulty: 'easy',
    description: 'Вызови fn максимум один раз; повторные вызовы возвращают первый результат.',
    solution: `export function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}`,
    test: `let n = 0;
const f = once(() => ++n);
assert(f() === 1 && f() === 1 && n === 1);`,
  },
  {
    num: 17, slug: 'memoize', folder: '02-functions-closures', title: 'memoize', tags: ['closures'], difficulty: 'easy',
    description: 'Кэшируй результат fn по JSON.stringify аргументов.',
    solution: `export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    test: `let c = 0;
const add = memoize((a, b) => { c++; return a + b; });
assert(add(1, 2) === 3 && c === 1);
assert(add(1, 2) === 3 && c === 1);`,
  },
  {
    num: 18, slug: 'memoize-resolver', folder: '02-functions-closures', title: 'memoize resolver', tags: ['closures'], difficulty: 'medium',
    description: 'memoize с функцией resolver(...args) → cache key.',
    solution: `export function memoizeResolver(fn, resolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    test: `let c = 0;
const f = memoizeResolver((x) => { c++; return x * 2; }, (x) => x);
assert(f(2) === 4 && f(2) === 4 && c === 1);`,
  },
  {
    num: 19, slug: 'debounce', folder: '02-functions-closures', title: 'debounce', tags: ['closures', 'dom'], difficulty: 'easy',
    description: 'trailing debounce: вызов fn после паузы wait мс.',
    solution: `export function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}`,
    test: `assert(typeof debounce(() => {}, 0) === 'function');`,
  },
  {
    num: 20, slug: 'debounce-leading', folder: '02-functions-closures', title: 'debounce leading', tags: ['closures'], difficulty: 'medium',
    description: 'debounce с опцией { leading: true } — первый вызов сразу.',
    solution: `export function debounceLeading(fn, wait, { leading = false } = {}) {
  let timer;
  return function (...args) {
    const callNow = leading && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; }, wait);
    if (callNow) fn.apply(this, args);
  };
}`,
    test: `assert(typeof debounceLeading(() => {}, 10, { leading: true }) === 'function');`,
  },
  {
    num: 21, slug: 'throttle', folder: '02-functions-closures', title: 'throttle', tags: ['closures'], difficulty: 'easy',
    description: 'throttle: не чаще одного вызова за wait мс.',
    solution: `export function throttle(fn, wait) {
  let last = 0;
  let timer;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}`,
    test: `assert(typeof throttle(() => {}, 100) === 'function');`,
  },
  {
    num: 22, slug: 'throttle-trailing', folder: '02-functions-closures', title: 'throttle trailing', tags: ['closures'], difficulty: 'medium',
    description: 'throttle с trailing вызовом в конце окна.',
    solution: `export function throttleTrailing(fn, wait) {
  let last = 0;
  let timer;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        fn.apply(this, args);
      }, wait - (now - last));
    }
  };
}`,
    test: `assert(typeof throttleTrailing(() => {}, 50) === 'function');`,
  },
  {
    num: 23, slug: 'curry', folder: '02-functions-closures', title: 'curry', tags: ['closures'], difficulty: 'easy',
    description: 'curry(fn, arity): каррирование фиксированной арности.',
    solution: `export function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...rest) => curried(...args, ...rest);
  };
}`,
    test: `const add = curry((a, b, c) => a + b + c, 3);
assert(add(1)(2)(3) === 6);`,
  },
  {
    num: 24, slug: 'curry-auto', folder: '02-functions-closures', title: 'curry auto', tags: ['closures'], difficulty: 'medium',
    description: 'auto-curry: накапливай аргументы до arity fn.length.',
    solution: `export function curryAuto(fn) {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}`,
    test: `const sum = curryAuto((a, b) => a + b);
assert(sum(1)(2) === 3);`,
  },
  {
    num: 25, slug: 'partial', folder: '02-functions-closures', title: 'partial', tags: ['closures'], difficulty: 'easy',
    description: 'partial(fn, ...preset): частичное применение аргументов.',
    solution: `export function partial(fn, ...preset) {
  return (...args) => fn(...preset, ...args);
}`,
    test: `const add = partial((a, b, c) => a + b + c, 1, 2);
assert(add(3) === 6);`,
  },
  {
    num: 26, slug: 'compose', folder: '02-functions-closures', title: 'compose', tags: ['closures'], difficulty: 'easy',
    description: 'compose(...fns): композиция справа налево.',
    solution: `export function compose(...fns) {
  return (x) => fns.reduceRight((v, fn) => fn(v), x);
}`,
    test: `const f = compose((x) => x + 1, (x) => x * 2);
assert(f(3) === 7);`,
  },
  {
    num: 27, slug: 'pipe', folder: '02-functions-closures', title: 'pipe', tags: ['closures'], difficulty: 'easy',
    description: 'pipe(...fns): композиция слева направо.',
    solution: `export function pipe(...fns) {
  return (x) => fns.reduce((v, fn) => fn(v), x);
}`,
    test: `const f = pipe((x) => x * 2, (x) => x + 1);
assert(f(3) === 7);`,
  },
  {
    num: 28, slug: 'create-counter', folder: '02-functions-closures', title: 'create counter', tags: ['closures'], difficulty: 'easy',
    description: 'Счётчик: increment, decrement, value.',
    solution: `export function createCounter(initial = 0) {
  let value = initial;
  return {
    increment() { return ++value; },
    decrement() { return --value; },
    get value() { return value; },
  };
}`,
    test: `const c = createCounter(10);
assert(c.increment() === 11 && c.decrement() === 10);`,
  },
  {
    num: 29, slug: 'create-stack', folder: '02-functions-closures', title: 'create stack', tags: ['closures'], difficulty: 'easy',
    description: 'Stack API: push, pop, peek, size.',
    solution: `export function createStack() {
  const items = [];
  return {
    push(v) { items.push(v); },
    pop() { return items.pop(); },
    peek() { return items[items.length - 1]; },
    get size() { return items.length; },
  };
}`,
    test: `const s = createStack();
s.push(1); s.push(2);
assert(s.pop() === 2 && s.peek() === 1);`,
  },
  {
    num: 30, slug: 'create-queue', folder: '02-functions-closures', title: 'create queue', tags: ['closures'], difficulty: 'easy',
    description: 'Queue FIFO: enqueue, dequeue, front.',
    solution: `export function createQueue() {
  const items = [];
  return {
    enqueue(v) { items.push(v); },
    dequeue() { return items.shift(); },
    get front() { return items[0]; },
    get size() { return items.length; },
  };
}`,
    test: `const q = createQueue();
q.enqueue(1); q.enqueue(2);
assert(q.dequeue() === 1 && q.front === 2);`,
  },
  {
    num: 31, slug: 'limiter', folder: '02-functions-closures', title: 'limiter', tags: ['closures'], difficulty: 'easy',
    description: 'Разреши вызов fn не более max раз.',
    solution: `export function limiter(fn, max) {
  let count = 0;
  return function (...args) {
    if (count >= max) return undefined;
    count++;
    return fn.apply(this, args);
  };
}`,
    test: `let n = 0;
const f = limiter(() => ++n, 2);
assert(f() === 1 && f() === 2 && f() === undefined);`,
  },
  {
    num: 32, slug: 'lazy', folder: '02-functions-closures', title: 'lazy', tags: ['closures'], difficulty: 'easy',
    description: 'lazy(factory): вычисли значение при первом get().',
    solution: `export function lazy(factory) {
  let computed = false;
  let value;
  return () => {
    if (!computed) {
      value = factory();
      computed = true;
    }
    return value;
  };
}`,
    test: `let n = 0;
const g = lazy(() => ++n);
assert(g() === 1 && g() === 1 && n === 1);`,
  },
  {
    num: 33, slug: 'retry-sync', folder: '02-functions-closures', title: 'retry sync', tags: ['closures'], difficulty: 'medium',
    description: 'retrySync(fn, times): повтори синхронную fn до успеха.',
    solution: `export function retrySync(fn, times) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}`,
    test: `let n = 0;
const v = retrySync(() => { if (++n < 3) throw new Error('fail'); return 'ok'; }, 5);
assert(v === 'ok' && n === 3);`,
  },
  {
    num: 34, slug: 'timed-cache', folder: '02-functions-closures', title: 'timed cache', tags: ['closures'], difficulty: 'medium',
    description: 'get(key) / set(key, val, ttlMs): кэш с TTL.',
    solution: `export function timedCache() {
  const store = new Map();
  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (Date.now() > entry.expires) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value, ttlMs) {
      store.set(key, { value, expires: Date.now() + ttlMs });
    },
  };
}`,
    test: `const c = timedCache();
c.set('a', 1, 10000);
assert(c.get('a') === 1);`,
  },
  {
    num: 35, slug: 'private-fields', folder: '02-functions-closures', title: 'private fields', tags: ['closures'], difficulty: 'easy',
    description: 'createSecret(value): get/set через замыкание.',
    solution: `export function createSecret(initial) {
  let secret = initial;
  return {
    get() { return secret; },
    set(v) { secret = v; },
  };
}`,
    test: `const s = createSecret(1);
s.set(2);
assert(s.get() === 2);`,
  },
  {
    num: 36, slug: 'module-pattern', folder: '02-functions-closures', title: 'module pattern', tags: ['patterns'], difficulty: 'easy',
    description: 'Revealing module: публичный API, приватное состояние.',
    solution: `export function createModule() {
  let count = 0;
  return {
    increment() { count++; },
    getCount() { return count; },
  };
}`,
    test: `const m = createModule();
m.increment();
assert(m.getCount() === 1);`,
  },
  {
    num: 37, slug: 'make-iterable', folder: '02-functions-closures', title: 'make iterable', tags: ['closures'], difficulty: 'medium',
    description: 'Объект с Symbol.iterator по массиву items.',
    solution: `export function makeIterable(items) {
  return {
    [Symbol.iterator]() {
      let i = 0;
      return {
        next() {
          if (i < items.length) return { value: items[i++], done: false };
          return { done: true };
        },
      };
    },
  };
}`,
    test: `assert([...makeIterable([1, 2])].join() === '1,2');`,
  },
  {
    num: 38, slug: 'tap', folder: '02-functions-closures', title: 'tap', tags: ['closures'], difficulty: 'easy',
    description: 'tap(value, fn): вызови fn для side-effect, верни value.',
    solution: `export function tap(value, fn) {
  fn(value);
  return value;
}`,
    test: `let x;
assert(tap(5, (v) => { x = v; }) === 5 && x === 5);`,
  },
  {
    num: 39, slug: 'negate', folder: '02-functions-closures', title: 'negate', tags: ['closures'], difficulty: 'easy',
    description: 'negate(pred): инвертируй предикат.',
    solution: `export function negate(pred) {
  return (...args) => !pred(...args);
}`,
    test: `const isEven = (n) => n % 2 === 0;
assert(negate(isEven)(3) === true);`,
  },
  {
    num: 40, slug: 'over', folder: '02-functions-closures', title: 'over', tags: ['closures'], difficulty: 'medium',
    description: 'over(obj, fns): примени fn к каждому полю объекта.',
    solution: `export function over(obj, fns) {
  const out = {};
  for (const key of Object.keys(obj)) {
    out[key] = fns[key] ? fns[key](obj[key]) : obj[key];
  }
  return out;
}`,
    test: `assert(over({ a: 1, b: 2 }, { a: (x) => x * 2 }).a === 2);`,
  },
];
