/**
 * 005 — List keys
 * @tags lists, keys
 * @difficulty easy
 *
 * ## Теория
 * key помогает React сопоставить элементы между рендерами. Стабильный уникальный id лучше index при reorder.
 *
 * ## На собеседовании
 * - Зачем key? — Идентификация sibling-элементов при diff.
 * - Почему index как key плох при сортировке? — Путается state дочерних компонентов.
 *
 * ## Связанные темы
 * webdev/15. react/021-pochemu-nelzya-ispolzovat-indeks-massiva-v-kachestve-key.md
 */

export type Tag = { id: string; label: string };

export function TagList({ tags }: { tags: readonly Tag[] }) {
  return (
    <ul>
      {tags.map((t) => (
        <li key={t.id}>{t.label}</li>
      ))}
    </ul>
  );
}
