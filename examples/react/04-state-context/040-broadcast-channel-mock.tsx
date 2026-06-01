/**
 * 040 — External store sync
 * @tags state
 * @difficulty hard
 *
 * ## Теория
 * useSyncExternalStore подписывается на внешний источник (store, browser API).
 *
 * ## На собеседовании
 * - Зачем useSyncExternalStore? — Консистентный snapshot для concurrent rendering.
 */

import { useSyncExternalStore } from 'react';

let external = 0;
const subs = new Set<() => void>();

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => subs.delete(cb);
}

function getSnapshot() {
  return external;
}

export function ExternalCounter() {
  const value = useSyncExternalStore(subscribe, getSnapshot);
  return (
    <div>
      <span data-testid="v">{value}</span>
      <button
        type="button"
        onClick={() => {
          external += 1;
          subs.forEach((s) => s());
        }}
      >
        Bump
      </button>
    </div>
  );
}
