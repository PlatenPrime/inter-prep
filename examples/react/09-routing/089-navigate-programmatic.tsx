/**
 * 089 — useNavigate
 * @tags router
 * @difficulty medium
 *
 * ## Теория
 * useNavigate() возвращает функцию для programmatic navigation.
 *
 * ## На собеседовании
 * - navigate(-1)? — history back.
 */

import { Route, Routes, useNavigate } from 'react-router-dom';

function Home() {
  const nav = useNavigate();
  return (
    <button type="button" onClick={() => nav('/done')}>
      Go
    </button>
  );
}

export function GoApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/done" element={<p>Done</p>} />
    </Routes>
  );
}
