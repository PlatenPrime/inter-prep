/**
 * 020 — Hydration-safe text
 * @tags ssr, hydration
 * @difficulty medium
 *
 * ## Теория
 * Разный HTML на сервере и клиенте вызывает hydration mismatch. Откладывайте client-only значения до useEffect.
 *
 * ## На собеседовании
 * - Как избежать mismatch для Date? — Рендер placeholder до mount или suppressHydrationWarning.
 */

import { useEffect, useState } from 'react';

export function ClientOnlyTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime('ready');
  }, []);
  return <p data-testid="time">{time ?? 'pending'}</p>;
}
