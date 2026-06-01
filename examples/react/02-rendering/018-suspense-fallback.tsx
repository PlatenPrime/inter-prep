/**
 * 018 — Suspense fallback
 * @tags suspense
 * @difficulty medium
 *
 * ## Теория
 * Suspense показывает fallback, пока дочерний компонент «ждёт» (lazy, data).
 *
 * ## На собеседовании
 * - Suspense vs loading state? — Декларативная граница для нескольких async источников.
 *
 * ## Связанные темы
 * webdev/15. react/051-kak-ispolzovat-react-lazy-i-react-suspense-dlya-zapuska-koda-prilozheniya.md
 */

import { Suspense, lazy } from 'react';

const Greeting = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => resolve({ default: () => <p>Hi</p> }), 20);
    }),
);

export function DelayedGreeting() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Greeting />
    </Suspense>
  );
}
