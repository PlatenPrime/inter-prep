import { queryKeyHash } from '../solutions/task-01-query-key-hash.ts';
import { staleTimeCheck } from '../solutions/task-02-stale-time-check.ts';
import { cacheEntry } from '../solutions/task-03-cache-entry.ts';
import { invalidatePrefix } from '../solutions/task-04-invalidate-prefix.ts';

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

console.log('Day 24 — React TanStack Query (solutions)\n');

assert('queryKeyHash', queryKeyHash(['users', 1]) === '["users",1]');

assert('staleTimeCheck', staleTimeCheck(0, 1000, 2000));
assert('staleTimeCheck fresh', !staleTimeCheck(1500, 1000, 2000));

const entry = cacheEntry({ x: 1 }, 100);
assert('cacheEntry', entry.data.x === 1 && entry.updatedAt === 100);

const cache = new Map<string, unknown>([
  [queryKeyHash(['users']), {}],
  [queryKeyHash(['users', 1]), {}],
  [queryKeyHash(['posts']), {}],
]);
const removed = invalidatePrefix(cache, ['users']);
assert('invalidatePrefix', removed.length === 2 && cache.size === 1 && cache.has(queryKeyHash(['posts'])));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
