/**
 * 036 — Stale closure fix
 * @tags hooks, closures
 * @difficulty medium
 *
 * ## Теория
 * Effect с пустым deps захватывает устаревший count. Решение: функциональный setState или deps [count].
 *
 * ## На собеседовании
 * - stale closure в setInterval? — Используйте ref на count или functional update.
 */

import { useEffect, useState } from 'react';

export function StaleSafeCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 50);
    return () => clearInterval(id);
  }, []);
  return <span data-testid="count">{count}</span>;
}
