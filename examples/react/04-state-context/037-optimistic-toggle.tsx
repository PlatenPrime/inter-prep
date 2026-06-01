/**
 * 037 — Optimistic UI
 * @tags state, ux
 * @difficulty medium
 *
 * ## Теория
 * Optimistic UI обновляет интерфейс до ответа сервера, откатывает при ошибке.
 *
 * ## На собеседовании
 * - Риски optimistic? — Нужен rollback и idempotency на сервере.
 */

import { useState } from 'react';

export function OptimisticLike({
  save,
}: {
  save: (liked: boolean) => Promise<void>;
}) {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const toggle = async () => {
    const next = !liked;
    setLiked(next);
    setPending(true);
    try {
      await save(next);
    } catch {
      setLiked(!next);
    } finally {
      setPending(false);
    }
  };
  return (
    <button type="button" onClick={toggle} disabled={pending} aria-pressed={liked}>
      {liked ? 'Liked' : 'Like'}
    </button>
  );
}
