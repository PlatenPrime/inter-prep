/**
 * 015 — useId
 * @tags hooks, a11y
 * @difficulty easy
 *
 * ## Теория
 * useId генерирует стабильный уникальный id для связки label/input на клиенте и SSR.
 *
 * ## На собеседовании
 * - Зачем useId вместо Math.random? — Стабильность между SSR и гидрацией.
 */

import { useId } from 'react';

export function LabeledInput({ label }: { label: string }) {
  const id = useId();
  return (
    <label htmlFor={id}>
      {label}
      <input id={id} />
    </label>
  );
}
