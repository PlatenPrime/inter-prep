/**
 * 004 — Conditional render
 * @tags rendering
 * @difficulty easy
 *
 * ## Теория
 * Условный рендер: &&, тернарный оператор или ранний return. false, null, undefined не рендерятся.
 *
 * ## На собеседовании
 * - Почему count && <List /> опасен при count=0? — Отрендерится 0 на экране.
 *
 * ## Связанные темы
 * webdev/15. react/024-chto-takoe-react-huki-hooks.md
 */

export function StatusBadge({ active }: { active: boolean }) {
  return <span>{active ? 'Active' : 'Inactive'}</span>;
}
