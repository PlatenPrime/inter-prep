/**
 * 200 — pipeline
 * @tags patterns
 * @difficulty medium
 *
 * createPipeline(): use(mw) → run(ctx).
 */

export function createPipeline() {
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
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const p = createPipeline();
  p.use(async (ctx, next) => { ctx.a = 1; return next(); });
  p.use(async (ctx, next) => { ctx.b = 2; return next(); });
  const ctx = await p.run({});
  assert(ctx.a === 1 && ctx.b === 2);
  console.log('200-pipeline: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
