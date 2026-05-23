/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 191, slug: 'singleton', folder: '11-patterns-practices', title: 'singleton', tags: ['patterns'], difficulty: 'easy',
    description: 'createSingleton(factory): один экземпляр.',
    solution: `export function createSingleton(factory) {
  let instance;
  return () => {
    if (!instance) instance = factory();
    return instance;
  };
}`,
    test: `const get = createSingleton(() => ({ id: Math.random() }));
assert(get() === get());`,
  },
  {
    num: 192, slug: 'factory', folder: '11-patterns-practices', title: 'factory', tags: ['patterns'], difficulty: 'easy',
    description: 'createUserFactory(defaults).',
    solution: `export function createUserFactory(defaults = {}) {
  return (overrides = {}) => ({ ...defaults, ...overrides, id: overrides.id ?? crypto.randomUUID?.() ?? String(Math.random()) });
}`,
    test: `const create = createUserFactory({ role: 'user' });
const u = create({ name: 'Ann' });
assert(u.role === 'user' && u.name === 'Ann');`,
  },
  {
    num: 193, slug: 'builder', folder: '11-patterns-practices', title: 'builder', tags: ['patterns'], difficulty: 'easy',
    description: 'QueryBuilder: select/from/where/build.',
    solution: `export function createQueryBuilder() {
  const parts = { select: '*', from: '', where: [] };
  return {
    select(cols) { parts.select = cols; return this; },
    from(table) { parts.from = table; return this; },
    where(cond) { parts.where.push(cond); return this; },
    build() {
      let sql = \`SELECT \${parts.select} FROM \${parts.from}\`;
      if (parts.where.length) sql += ' WHERE ' + parts.where.join(' AND ');
      return sql;
    },
  };
}`,
    test: `const sql = createQueryBuilder().select('id').from('users').where('id=1').build();
assert(sql.includes('SELECT id') && sql.includes('WHERE'));`,
  },
  {
    num: 194, slug: 'strategy', folder: '11-patterns-practices', title: 'strategy', tags: ['patterns'], difficulty: 'easy',
    description: 'createContext(strategies): run(name, ...args).',
    solution: `export function createContext(strategies) {
  return {
    run(name, ...args) {
      const fn = strategies[name];
      if (!fn) throw new Error(\`Unknown strategy: \${name}\`);
      return fn(...args);
    },
  };
}`,
    test: `const ctx = createContext({ add: (a, b) => a + b });
assert(ctx.run('add', 1, 2) === 3);`,
  },
  {
    num: 195, slug: 'decorator', folder: '11-patterns-practices', title: 'decorator', tags: ['patterns'], difficulty: 'easy',
    description: 'withLogging(fn): лог + вызов.',
    solution: `export function withLogging(fn, log = console.log) {
  return (...args) => {
    log('call', args);
    const result = fn(...args);
    log('result', result);
    return result;
  };
}`,
    test: `const f = withLogging((x) => x * 2, () => {});
assert(f(3) === 6);`,
  },
  {
    num: 196, slug: 'adapter', folder: '11-patterns-practices', title: 'adapter', tags: ['patterns'], difficulty: 'easy',
    description: 'adaptLegacyApi(legacy): modern { fetchUser(id) }.',
    solution: `export function adaptLegacyApi(legacy) {
  return {
    async fetchUser(id) {
      return new Promise((resolve, reject) => {
        legacy.getUser(id, (err, user) => (err ? reject(err) : resolve(user)));
      });
    },
  };
}`,
    test: `const api = adaptLegacyApi({ getUser: (id, cb) => cb(null, { id }) });
assert((await api.fetchUser(1)).id === 1);`,
    runAsync: true,
  },
  {
    num: 197, slug: 'rate-limiter', folder: '11-patterns-practices', title: 'rate limiter', tags: ['patterns'], difficulty: 'medium',
    description: 'createRateLimiter(max, windowMs): tryAcquire().',
    solution: `export function createRateLimiter(max, windowMs) {
  const timestamps = [];
  return {
    tryAcquire() {
      const now = Date.now();
      while (timestamps.length && timestamps[0] <= now - windowMs) timestamps.shift();
      if (timestamps.length >= max) return false;
      timestamps.push(now);
      return true;
    },
  };
}`,
    test: `const rl = createRateLimiter(2, 10000);
assert(rl.tryAcquire() && rl.tryAcquire() && !rl.tryAcquire());`,
  },
  {
    num: 198, slug: 'circuit-breaker', folder: '11-patterns-practices', title: 'circuit breaker', tags: ['patterns'], difficulty: 'medium',
    description: 'createCircuitBreaker(fn, { threshold, resetMs }).',
    solution: `export function createCircuitBreaker(fn, { threshold = 3, resetMs = 1000 } = {}) {
  let failures = 0;
  let openUntil = 0;
  return async function (...args) {
    if (Date.now() < openUntil) throw new Error('Circuit open');
    try {
      const result = await fn(...args);
      failures = 0;
      return result;
    } catch (e) {
      failures++;
      if (failures >= threshold) openUntil = Date.now() + resetMs;
      throw e;
    }
  };
}`,
    test: `let n = 0;
const fn = createCircuitBreaker(async () => { if (++n < 4) throw new Error('fail'); return 'ok'; }, { threshold: 2, resetMs: 1 });
try { await fn(); } catch {}
try { await fn(); } catch {}
try { await fn(); assert(false); } catch (e) { assert(e.message === 'Circuit open'); }`,
    runAsync: true,
  },
  {
    num: 199, slug: 'pub-sub', folder: '11-patterns-practices', title: 'pub sub', tags: ['patterns'], difficulty: 'easy',
    description: 'createPubSub(): publish/subscribe.',
    solution: `export function createPubSub() {
  const subs = new Map();
  return {
    subscribe(topic, fn) {
      if (!subs.has(topic)) subs.set(topic, new Set());
      subs.get(topic).add(fn);
      return () => subs.get(topic)?.delete(fn);
    },
    publish(topic, data) {
      subs.get(topic)?.forEach((fn) => fn(data));
    },
  };
}`,
    test: `const ps = createPubSub();
let v = 0;
ps.subscribe('t', (d) => { v = d; });
ps.publish('t', 42);
assert(v === 42);`,
  },
  {
    num: 200, slug: 'pipeline', folder: '11-patterns-practices', title: 'pipeline', tags: ['patterns'], difficulty: 'medium',
    description: 'createPipeline(): use(mw) → run(ctx).',
    solution: `export function createPipeline() {
  const middlewares = [];
  return {
    use(fn) { middlewares.push(fn); return this; },
    async run(ctx) {
      let index = 0;
      const next = async () => {
        if (index >= middlewares.length) return ctx;
        const fn = middlewares[index++];
        return fn(ctx, next);
      };
      return next();
    },
  };
}`,
    test: `const p = createPipeline();
p.use(async (ctx, next) => { ctx.a = 1; return next(); });
p.use(async (ctx, next) => { ctx.b = 2; return next(); });
const ctx = await p.run({});
assert(ctx.a === 1 && ctx.b === 2);`,
    runAsync: true,
  },
];
