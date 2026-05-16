import { classifyError } from '../solutions/task-01-classify-error.ts';
import { retryBoundary } from '../solutions/task-02-retry-boundary.ts';
import { suspenseReady } from '../solutions/task-03-suspense-ready.ts';
import { errorFallbackProps } from '../solutions/task-04-error-fallback-props.ts';

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

console.log('Day 28 — React Error & Suspense (solutions)\n');

assert('classifyError network', classifyError({ status: 0 }) === 'network');
assert('classifyError auth', classifyError({ status: 401 }) === 'auth');

const retried = retryBoundary({ resetKey: 0, hasError: true });
assert('retryBoundary', retried.resetKey === 1 && !retried.hasError);

assert('suspenseReady', suspenseReady({ status: 'success', value: 1 }));
assert('suspenseReady pending', !suspenseReady({ status: 'pending' }));

const fb = errorFallbackProps(new Error('fail'));
assert('errorFallbackProps', fb.canRetry && fb.message === 'fail');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
