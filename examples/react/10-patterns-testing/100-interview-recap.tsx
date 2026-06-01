/**
 * 100 — Interview recap app
 * @tags patterns, recap
 * @difficulty medium
 *
 * ## Теория
 * Мини-приложение: список + фильтр + loading — типичный live-coding сценарий на middle interview.
 *
 * ## На собеседовании
 * - С чего начать live coding? — UI skeleton, types, happy path, tests.
 */

import { useMemo, useState } from 'react';

const SKILLS = ['React', 'TypeScript', 'CSS', 'Node'] as const;

export function RecapApp() {
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => SKILLS.filter((s) => s.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div>
      <input aria-label="Filter skills" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>
        {filtered.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p data-testid="count">{filtered.length} shown</p>
    </div>
  );
}
