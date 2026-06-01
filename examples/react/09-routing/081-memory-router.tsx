/**
 * 081 — MemoryRouter
 * @tags router
 * @difficulty easy
 *
 * ## Теория
 * MemoryRouter хранит history в памяти — идеален для тестов без браузера.
 *
 * ## На собеседовании
 * - BrowserRouter vs MemoryRouter? — URL bar vs in-memory.
 */

import { Route, Routes } from 'react-router-dom';

export function HomePage() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  );
}
