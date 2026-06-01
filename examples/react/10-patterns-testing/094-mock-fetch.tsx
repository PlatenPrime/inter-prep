/**
 * 094 — Mock fetch
 * @tags testing, mock
 * @difficulty medium
 *
 * ## Теория
 * vi.stubGlobal('fetch', ...) или MSW для HTTP. Восстанавливайте после теста.
 *
 * ## На собеседовании
 * - MSW vs vi.fn fetch? — MSW ближе к сети, vi.fn проще для unit.
 */

import { useEffect, useState } from 'react';

export function FetchUser() {
  const [name, setName] = useState('');
  useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((d: { name: string }) => setName(d.name));
  }, []);
  return <p data-testid="name">{name || 'loading'}</p>;
}
