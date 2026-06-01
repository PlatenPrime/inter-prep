/**
 * 045 — Virtual list slice
 * @tags virtualization
 * @difficulty hard
 *
 * ## Теория
 * Виртуализация рендерит только видимое окно индексов. slice(start, end) по scroll position.
 *
 * ## На собеседовании
 * - react-window / virtuoso? — Готовые libs для больших списков.
 */

export function VirtualSlice({
  items,
  start,
  end,
}: {
  items: string[];
  start: number;
  end: number;
}) {
  const visible = items.slice(start, end);
  return (
    <ul>
      {visible.map((item, i) => (
        <li key={start + i}>{item}</li>
      ))}
    </ul>
  );
}
