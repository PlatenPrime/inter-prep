/**
 * 019 — lazy + Suspense
 * @tags lazy, code-splitting
 * @difficulty medium
 *
 * ## Теория
 * React.lazy загружает компонент динамически; обязателен Suspense выше по дереву.
 *
 * ## На собеседовании
 * - lazy и SSR? — Нужен bundler с поддержкой и Suspense на сервере.
 */

import { Suspense, lazy } from 'react';

const Heavy = lazy(() =>
  Promise.resolve({ default: () => <p>Heavy loaded</p> }),
);

export function LazyPanel() {
  return (
    <Suspense fallback={<p>Loading chunk…</p>}>
      <Heavy />
    </Suspense>
  );
}
