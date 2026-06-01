/**
 * 022 — useEffect cleanup
 * @tags useEffect
 * @difficulty medium
 *
 * ## Теория
 * useEffect после paint. Cleanup перед следующим effect и unmount — отмена подписок, таймеров.
 *
 * ## На собеседовании
 * - Пустой deps []? — Mount/unmount. Без deps — каждый render.
 */

import { useEffect, useState } from 'react';

export function Timer({ ms }: { ms: number }) {
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return <span data-testid="ticks">{ticks}</span>;
}
