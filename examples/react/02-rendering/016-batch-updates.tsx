/**
 * 016 — Batch updates
 * @tags rendering, state
 * @difficulty medium
 *
 * ## Теория
 * React 18 батчит несколько setState в одном event handler в один re-render.
 *
 * ## На собеседовании
 * - Automatic batching в async? — В 18+ да, в setTimeout тоже батчится.
 */

import { useState } from 'react';

export function BatchCounter() {
  const [count, setCount] = useState(0);
  const incrementTwice = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button type="button" onClick={incrementTwice}>
        +2
      </button>
    </div>
  );
}
