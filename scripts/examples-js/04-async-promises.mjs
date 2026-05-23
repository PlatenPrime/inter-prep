/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 56, slug: 'delay', folder: '04-async-promises', title: 'delay', tags: ['async'], difficulty: 'easy',
    description: 'delay(ms): Promise, резолвится через ms.',
    solution: `export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    test: `const t = Date.now();
await delay(5);
assert(Date.now() - t >= 4);`,
    runAsync: true,
  },
  {
    num: 57, slug: 'promisify', folder: '04-async-promises', title: 'promisify', tags: ['async'], difficulty: 'medium',
    description: 'promisify(fn): callback-last-arg → Promise.',
    solution: `export function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}`,
    test: `const cb = (a, b, done) => done(null, a + b);
const p = promisify(cb);
assert((await p(1, 2)) === 3);`,
    runAsync: true,
  },
  {
    num: 58, slug: 'promise-all', folder: '04-async-promises', title: 'promise all', tags: ['async'], difficulty: 'medium',
    description: 'Реализуй Promise.all.',
    solution: `export function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (arr.length === 0) return resolve([]);
    const results = new Array(arr.length);
    let settled = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          results[i] = v;
          if (++settled === arr.length) resolve(results);
        },
        reject,
      );
    });
  });
}`,
    test: `const r = await promiseAll([Promise.resolve(1), 2]);
assert(r[0] === 1 && r[1] === 2);`,
    runAsync: true,
  },
  {
    num: 59, slug: 'promise-race', folder: '04-async-promises', title: 'promise race', tags: ['async'], difficulty: 'easy',
    description: 'Реализуй Promise.race.',
    solution: `export function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const p of iterable) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}`,
    test: `assert((await promiseRace([new Promise((r) => setTimeout(() => r(0), 50)), Promise.resolve(1)])) === 1);`,
    runAsync: true,
  },
  {
    num: 60, slug: 'promise-all-settled', folder: '04-async-promises', title: 'promise all settled', tags: ['async'], difficulty: 'medium',
    description: 'Реализуй Promise.allSettled.',
    solution: `export function promiseAllSettled(iterable) {
  return Promise.all(
    [...iterable].map((p) =>
      Promise.resolve(p)
        .then((value) => ({ status: 'fulfilled', value }))
        .catch((reason) => ({ status: 'rejected', reason })),
    ),
  );
}`,
    test: `const r = await promiseAllSettled([1, Promise.reject('e')]);
assert(r[0].status === 'fulfilled' && r[1].status === 'rejected');`,
    runAsync: true,
  },
  {
    num: 61, slug: 'promise-any', folder: '04-async-promises', title: 'promise any', tags: ['async'], difficulty: 'medium',
    description: 'Реализуй Promise.any (первый fulfilled).',
    solution: `export function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (arr.length === 0) return reject(new AggregateError([], 'All rejected'));
    const errors = [];
    let rejected = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (e) => {
        errors[i] = e;
        if (++rejected === arr.length) reject(new AggregateError(errors, 'All rejected'));
      });
    });
  });
}`,
    test: `assert((await promiseAny([Promise.reject(1), Promise.resolve(2)])) === 2);`,
    runAsync: true,
  },
  {
    num: 62, slug: 'sequence', folder: '04-async-promises', title: 'sequence', tags: ['async'], difficulty: 'medium',
    description: 'sequence(tasks): выполни async-функции по очереди.',
    solution: `export async function sequence(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}`,
    test: `const r = await sequence([() => Promise.resolve(1), () => Promise.resolve(2)]);
assert(r.join() === '1,2');`,
    runAsync: true,
  },
  {
    num: 63, slug: 'map-limit', folder: '04-async-promises', title: 'map limit', tags: ['async'], difficulty: 'medium',
    description: 'mapLimit(items, limit, fn): параллель с лимитом.',
    solution: `export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}`,
    test: `const r = await mapLimit([1, 2, 3], 2, async (x) => x * 2);
assert(r.join() === '2,4,6');`,
    runAsync: true,
  },
  {
    num: 64, slug: 'retry-async', folder: '04-async-promises', title: 'retry async', tags: ['async'], difficulty: 'medium',
    description: 'retryAsync(fn, times): повтори async fn.',
    solution: `export async function retryAsync(fn, times) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}`,
    test: `let n = 0;
const v = await retryAsync(async () => { if (++n < 2) throw new Error(); return 1; }, 3);
assert(v === 1);`,
    runAsync: true,
  },
  {
    num: 65, slug: 'timeout-promise', folder: '04-async-promises', title: 'timeout promise', tags: ['async'], difficulty: 'medium',
    description: 'timeoutPromise(promise, ms): reject по таймауту.',
    solution: `export function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms),
    ),
  ]);
}`,
    test: `try {
  await timeoutPromise(new Promise((r) => setTimeout(r, 100)), 5);
  assert(false);
} catch (e) {
  assert(e.message === 'Timeout');
}`,
    runAsync: true,
  },
  {
    num: 66, slug: 'cancelable-promise', folder: '04-async-promises', title: 'cancelable promise', tags: ['async'], difficulty: 'medium',
    description: 'cancelablePromise(executor): { promise, cancel }.',
    solution: `export function cancelablePromise(executor) {
  let reject;
  const promise = new Promise((res, rej) => {
    reject = rej;
    executor(res, rej);
  });
  return {
    promise,
    cancel() {
      reject(new Error('Cancelled'));
    },
  };
}`,
    test: `const { promise, cancel } = cancelablePromise((res) => setTimeout(() => res(1), 50));
cancel();
try { await promise; assert(false); } catch (e) { assert(e.message === 'Cancelled'); }`,
    runAsync: true,
  },
  {
    num: 67, slug: 'sleep-scheduler', folder: '04-async-promises', title: 'sleep scheduler', tags: ['async'], difficulty: 'medium',
    description: 'createScheduler(): schedule(fn, delayMs).',
    solution: `export function createScheduler() {
  const queue = [];
  let running = false;
  async function drain() {
    if (running) return;
    running = true;
    while (queue.length) {
      const { fn, delayMs } = queue.shift();
      await new Promise((r) => setTimeout(r, delayMs));
      await fn();
    }
    running = false;
  }
  return {
    schedule(fn, delayMs) {
      queue.push({ fn, delayMs });
      drain();
    },
  };
}`,
    test: `const s = createScheduler();
let v = 0;
s.schedule(async () => { v = 1; }, 1);
await new Promise((r) => setTimeout(r, 10));
assert(v === 1);`,
    runAsync: true,
  },
  {
    num: 68, slug: 'async-queue', folder: '04-async-promises', title: 'async queue', tags: ['async'], difficulty: 'medium',
    description: 'AsyncQueue: enqueue возвращает Promise результата.',
    solution: `export function createAsyncQueue() {
  const pending = [];
  let processing = false;
  async function process() {
    if (processing) return;
    processing = true;
    while (pending.length) {
      const { fn, resolve, reject } = pending.shift();
      try {
        resolve(await fn());
      } catch (e) {
        reject(e);
      }
    }
    processing = false;
  }
  return {
    enqueue(fn) {
      return new Promise((resolve, reject) => {
        pending.push({ fn, resolve, reject });
        process();
      });
    },
  };
}`,
    test: `const q = createAsyncQueue();
const r = await q.enqueue(async () => 42);
assert(r === 42);`,
    runAsync: true,
  },
  {
    num: 69, slug: 'debounce-async', folder: '04-async-promises', title: 'debounce async', tags: ['async'], difficulty: 'medium',
    description: 'debounceAsync(fn, wait): debounce для async fn.',
    solution: `export function debounceAsync(fn, wait) {
  let timer;
  return function (...args) {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        Promise.resolve(fn.apply(this, args)).then(resolve, reject);
      }, wait);
    });
  };
}`,
    test: `assert(typeof debounceAsync(async () => 1, 0) === 'function');`,
    runAsync: true,
  },
  {
    num: 70, slug: 'pool', folder: '04-async-promises', title: 'pool', tags: ['async'], difficulty: 'medium',
    description: 'createPool(limit): run(task) с ограничением concurrency.',
    solution: `export function createPool(limit) {
  let active = 0;
  const queue = [];
  async function runNext() {
    if (active >= limit || !queue.length) return;
    active++;
    const { task, resolve, reject } = queue.shift();
    try {
      resolve(await task());
    } catch (e) {
      reject(e);
    } finally {
      active--;
      runNext();
    }
  }
  return {
    run(task) {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        runNext();
      });
    },
  };
}`,
    test: `const pool = createPool(2);
const r = await pool.run(async () => 1);
assert(r === 1);`,
    runAsync: true,
  },
  {
    num: 71, slug: 'mutex', folder: '04-async-promises', title: 'mutex', tags: ['async'], difficulty: 'medium',
    description: 'createMutex(): acquire/release для критической секции.',
    solution: `export function createMutex() {
  let locked = false;
  const waiters = [];
  return {
    async acquire() {
      if (!locked) {
        locked = true;
        return;
      }
      await new Promise((resolve) => waiters.push(resolve));
      locked = true;
    },
    release() {
      const next = waiters.shift();
      if (next) next();
      else locked = false;
    },
  };
}`,
    test: `const m = createMutex();
await m.acquire();
m.release();
assert(true);`,
    runAsync: true,
  },
  {
    num: 72, slug: 'barrier', folder: '04-async-promises', title: 'barrier', tags: ['async'], difficulty: 'medium',
    description: 'createBarrier(n): await пока n участников не вызовут await().',
    solution: `export function createBarrier(count) {
  let arrived = 0;
  let resolveAll;
  const promise = new Promise((r) => { resolveAll = r; });
  return {
    async await() {
      arrived++;
      if (arrived >= count) resolveAll();
      return promise;
    },
  };
}`,
    test: `const b = createBarrier(2);
const p1 = b.await();
const p2 = b.await();
await Promise.all([p1, p2]);
assert(true);`,
    runAsync: true,
  },
  {
    num: 73, slug: 'poll', folder: '04-async-promises', title: 'poll', tags: ['async'], difficulty: 'medium',
    description: 'poll(fn, intervalMs): опрашивай пока fn() !== true.',
    solution: `export async function poll(fn, intervalMs, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await fn()) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}`,
    test: `let n = 0;
const ok = await poll(async () => ++n >= 2, 1);
assert(ok === true);`,
    runAsync: true,
  },
  {
    num: 74, slug: 'exponential-backoff', folder: '04-async-promises', title: 'exponential backoff', tags: ['async'], difficulty: 'easy',
    description: 'backoffDelay(attempt, baseMs): экспоненциальная задержка.',
    solution: `export function backoffDelay(attempt, baseMs = 100) {
  return baseMs * 2 ** attempt;
}`,
    test: `assert(backoffDelay(0) === 100);
assert(backoffDelay(2) === 400);`,
  },
  {
    num: 75, slug: 'parallel-map', folder: '04-async-promises', title: 'parallel map', tags: ['async'], difficulty: 'medium',
    description: 'parallelMap(items, fn, concurrency).',
    solution: `export async function parallelMap(items, fn, concurrency = Infinity) {
  return mapLimit(items, concurrency, fn);
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}`,
    test: `const r = await parallelMap([1, 2], async (x) => x + 1, 2);
assert(r.join() === '2,3');`,
    runAsync: true,
  },
  {
    num: 76, slug: 'waterfall', folder: '04-async-promises', title: 'waterfall', tags: ['async'], difficulty: 'medium',
    description: 'waterfall(tasks, initial): цепочка async (value) => value.',
    solution: `export async function waterfall(tasks, initial) {
  let value = initial;
  for (const task of tasks) {
    value = await task(value);
  }
  return value;
}`,
    test: `const r = await waterfall([(v) => v + 1, async (v) => v * 2], 1);
assert(r === 4);`,
    runAsync: true,
  },
  {
    num: 77, slug: 'promise-defer', folder: '04-async-promises', title: 'promise defer', tags: ['async'], difficulty: 'easy',
    description: 'createDeferred(): { promise, resolve, reject }.',
    solution: `export function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}`,
    test: `const d = createDeferred();
d.resolve(1);
assert((await d.promise) === 1);`,
    runAsync: true,
  },
  {
    num: 78, slug: 'async-once', folder: '04-async-promises', title: 'async once', tags: ['async'], difficulty: 'medium',
    description: 'asyncOnce(fn): один inflight/результат для async.',
    solution: `export function asyncOnce(fn) {
  let promise;
  return function (...args) {
    if (!promise) promise = Promise.resolve(fn.apply(this, args));
    return promise;
  };
}`,
    test: `let n = 0;
const f = asyncOnce(async () => ++n);
await f(); await f();
assert(n === 1);`,
    runAsync: true,
  },
  {
    num: 79, slug: 'async-memoize', folder: '04-async-promises', title: 'async memoize', tags: ['async'], difficulty: 'medium',
    description: 'asyncMemoize(fn): кэш Promise по ключу.',
    solution: `export function asyncMemoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return async function (...args) {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const p = Promise.resolve(fn.apply(this, args));
    cache.set(key, p);
    return p;
  };
}`,
    test: `let c = 0;
const f = asyncMemoize(async (x) => { c++; return x; });
await f(1); await f(1);
assert(c === 1);`,
    runAsync: true,
  },
  {
    num: 80, slug: 'settle-first', folder: '04-async-promises', title: 'settle first', tags: ['async'], difficulty: 'easy',
    description: 'settleFirst(promises): первый успешный результат.',
    solution: `export function settleFirst(promises) {
  return promiseAny(promises);
}

function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (!arr.length) return reject(new AggregateError([], 'All rejected'));
    const errors = [];
    let rejected = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (e) => {
        errors[i] = e;
        if (++rejected === arr.length) reject(new AggregateError(errors));
      });
    });
  });
}`,
    test: `assert((await settleFirst([Promise.reject(0), Promise.resolve(5)])) === 5);`,
    runAsync: true,
  },
];
