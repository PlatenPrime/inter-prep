/**
 * 007 — Event handler
 * @tags events
 * @difficulty easy
 *
 * ## Теория
 * Обработчики в JSX — camelCase (onClick). React использует SyntheticEvent с делегированием.
 * Передавайте функцию, а не вызов: onClick={handleClick}.
 *
 * ## На собеседовании
 * - Синтетические события — пулинг убран в React 17+, делегирование на root.
 *
 * ## Связанные темы
 * webdev/15. react/055-chto-takoe-sinteticheskie-sobytiya-syntheticevent-v-react.md
 */

import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button type="button" onClick={() => setLiked((v) => !v)} aria-pressed={liked}>
      {liked ? 'Liked' : 'Like'}
    </button>
  );
}
