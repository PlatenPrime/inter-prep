/**
 * 046 — Debounced search
 * @tags debounce, performance
 * @difficulty medium
 *
 * ## Теория
 * Debounce откладывает вызов до паузы ввода. Снижает запросы и тяжёлый filter.
 *
 * ## На собеседовании
 * - debounce vs throttle? — Последний вызов после паузы vs равномерные вызовы.
 */

import { useEffect, useState } from 'react';

export function DebouncedSearch({ delay = 200 }: { delay?: number }) {
  const [raw, setRaw] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebounced(raw), delay);
    return () => clearTimeout(id);
  }, [raw, delay]);
  return (
    <div>
      <input aria-label="Query" value={raw} onChange={(e) => setRaw(e.target.value)} />
      <p data-testid="debounced">{debounced}</p>
    </div>
  );
}
