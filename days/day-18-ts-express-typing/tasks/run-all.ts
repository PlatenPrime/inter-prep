import { wrapHandler } from '../solutions/task-01-wrap-handler.ts';
import { parseRouteParams } from '../solutions/task-02-parse-route-params.ts';
import { middlewareChain } from '../solutions/task-03-middleware-chain.ts';
import { errorHandlerShape } from '../solutions/task-04-error-handler-shape.ts';

let passed = 0;
let failed = 0;

function assert(name: boolean | string, condition?: boolean): void {
  const label = typeof name === 'string' ? name : 'assert';
  const ok = typeof name === 'string' ? Boolean(condition) : Boolean(name);
  if (ok) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}`);
  }
}

console.log('Day 18 — TS Express Typing (solutions)\n');

const handler = wrapHandler(async (_req, res) => {
  throw new Error('boom');
});
const res = { json: (b: unknown) => b };
await handler({}, res);
assert('wrapHandler', true);

assert('parseRouteParams', parseRouteParams('/users/:id', '/users/42')?.id === '42');
assert('parseRouteParams miss', parseRouteParams('/users/:id', '/posts/1') === null);

const ctx: { done?: boolean } = {};
let order = '';
await middlewareChain([
  async (_c, next) => { order += '1'; await next(); },
  async (c, next) => { c.done = true; order += '2'; await next(); },
  async () => { order += '3'; },
])(ctx);
assert('middlewareChain', order === '12');

assert('errorHandlerShape', errorHandlerShape({ status: 404, message: 'Nope' }).status === 404);
assert('errorHandlerShape default', errorHandlerShape(new Error('x')).status === 500);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
