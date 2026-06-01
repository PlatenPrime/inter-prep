/**
 * 048 — Lazy route mock
 * @tags lazy, routing
 * @difficulty medium
 *
 * ## Теория
 * Code splitting по маршрутам: lazy(() => import('./Page')). Suspense на уровне layout.
 *
 * ## На собеседовании
 * - Как измерить bundle split? — Анализатор webpack/vite rollup.
 */

import { Suspense, lazy, useState } from 'react';

const PageB = lazy(() => Promise.resolve({ default: () => <p>Page B</p> }));

export function LazyRoute() {
  const [page, setPage] = useState<'a' | 'b'>('a');
  return (
    <div>
      <button type="button" onClick={() => setPage('b')}>
        Go B
      </button>
      {page === 'a' ? (
        <p>Page A</p>
      ) : (
        <Suspense fallback={<p>Loading B…</p>}>
          <PageB />
        </Suspense>
      )}
    </div>
  );
}
