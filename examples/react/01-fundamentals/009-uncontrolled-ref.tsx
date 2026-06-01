/**
 * 009 — Uncontrolled ref
 * @tags refs, forms
 * @difficulty medium
 *
 * ## Теория
 * Uncontrolled: DOM хранит значение, ref.current читается по submit. Меньше ре-рендеров на каждый символ.
 *
 * ## На собеседовании
 * - Когда uncontrolled? — Простые формы, интеграция с не-React библиотеками.
 */

import { useRef } from 'react';

export function RefForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(inputRef.current?.value ?? '');
      }}
    >
      <input ref={inputRef} defaultValue="" aria-label="Email" />
      <button type="submit">Send</button>
    </form>
  );
}
