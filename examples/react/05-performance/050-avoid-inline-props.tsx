/**
 * 050 — Avoid inline object props
 * @tags performance, memo
 * @difficulty medium
 *
 * ## Теория
 * style={{ color: 'red' }} создаёт новый объект каждый render — ломает shallow compare в memo children.
 *
 * ## На собеседовании
 * - Как исправить? — useMemo для style или className.
 */

import { useMemo } from 'react';

export function StyleBox({ active }: { active: boolean }) {
  const style = useMemo(
    () => ({ color: active ? 'green' : 'gray' }),
    [active],
  );
  return <p style={style} data-testid="box">Box</p>;
}
