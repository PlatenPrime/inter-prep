/**
 * 064 — forwardRef input
 * @tags refs, composition
 * @difficulty medium
 *
 * ## Теория
 * forwardRef пробрасывает ref на DOM внутри компонента. React 19: ref как обычный prop.
 *
 * ## На собеседовании
 * - Зачем forwardRef? — Библиотечные inputs, focus management.
 */

import { forwardRef } from 'react';

export const TextInput = forwardRef<HTMLInputElement, { label: string }>(function TextInput(
  { label },
  ref,
) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
