/**
 * 043 — useMemo calculation
 * @tags useMemo
 * @difficulty medium
 *
 * ## Теория
 * useMemo кеширует тяжёлое вычисление. Профилируйте перед оптимизацией.
 *
 * ## На собеседовании
 * - Преждевременная оптимизация? — memo всё подряд ухудшает читаемость.
 */

import { useMemo, useState } from 'react';

function sumTo(n: number) {
  let s = 0;
  for (let i = 0; i <= n; i++) s += i;
  return s;
}

export function ExpensiveSum({ n }: { n: number }) {
  const [bump, setBump] = useState(0);
  const total = useMemo(() => sumTo(n), [n]);
  return (
    <div>
      <span data-testid="total">{total}</span>
      <button type="button" onClick={() => setBump((v) => v + 1)}>
        Bump {bump}
      </button>
    </div>
  );
}
