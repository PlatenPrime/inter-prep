import { matchRoute } from '../solutions/task-01-match-route.ts';
import { buildLoaderData } from '../solutions/task-02-build-loader-data.ts';
import { protectedRoute } from '../solutions/task-03-protected-route.ts';
import { parseSearchParams } from '../solutions/task-04-parse-search-params.ts';

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

console.log('Day 29 — React Router Data (solutions)\n');

assert('matchRoute', matchRoute('/users/:id', '/users/42')?.id === '42');

assert('buildLoaderData', (buildLoaderData({ user: 1 }, { post: 2 }) as { user: number }).user === 1);

assert('protectedRoute', protectedRoute(false, '/dash')?.includes('from=%2Fdash') === true);
assert('protectedRoute authed', protectedRoute(true, '/dash') === null);

const sp = new URLSearchParams('q=hello&page=2');
assert('parseSearchParams', parseSearchParams(sp).q === 'hello');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
