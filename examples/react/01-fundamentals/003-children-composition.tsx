/**
 * 003 — Children composition
 * @tags children, composition
 * @difficulty easy
 *
 * ## Теория
 * children — особый prop: вложенный JSX между тегами. Композиция предпочтительнее prop drilling для layout.
 *
 * ## На собеседовании
 * - Что такое children? — ReactNode, переданный между открывающим и закрывающим тегом.
 *
 * ## Связанные темы
 * webdev/15. react/009-raznica-mezhdu-komponentom-i-kontejnerom.md
 */

import type { ReactNode } from 'react';

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
