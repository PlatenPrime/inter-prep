/**
 * 090 — 404 fallback
 * @tags router
 * @difficulty easy
 *
 * ## Теория
 * path="*" — catch-all для unknown routes.
 *
 * ## На собеседовании
 * - 404 в SPA? — Сервер отдаёт index.html, клиент показывает NotFound.
 */

import { Route, Routes } from 'react-router-dom';

export function NotFoundApp() {
  return (
    <Routes>
      <Route path="/" element={<p>Home</p>} />
      <Route path="*" element={<p>Not found</p>} />
    </Routes>
  );
}
