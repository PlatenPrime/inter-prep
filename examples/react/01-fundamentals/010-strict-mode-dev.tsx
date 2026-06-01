/**
 * 010 — StrictMode in dev
 * @tags strict-mode
 * @difficulty medium
 *
 * ## Теория
 * StrictMode в dev дважды монтирует компоненты, чтобы выявить side effects без cleanup.
 * В тестах обычно не оборачивают в StrictMode, если проверяют счётчики вызовов.
 *
 * ## На собеседовании
 * - Зачем двойной mount? — Имитация remount при будущих concurrent features.
 *
 * ## Связанные темы
 * webdev/15. react/048-chto-takoe-strogij-rezhim-v-react-ego-preimushchestva.md
 */

import { useEffect, useState } from 'react';

export function MountLogger() {
  const [mounts, setMounts] = useState(0);
  useEffect(() => {
    setMounts((m) => m + 1);
    return () => undefined;
  }, []);
  return <p data-testid="mounts">{mounts}</p>;
}
