/**
 * 084 — Search params
 * @tags router
 * @difficulty medium
 *
 * ## Теория
 * useSearchParams — URLSearchParams для фильтров и shareable state.
 *
 * ## На собеседовании
 * - search params vs state? — Shareable URL, back button.
 */

import { Route, Routes, useSearchParams } from 'react-router-dom';

function Search() {
  const [params] = useSearchParams();
  return <p>Query: {params.get('q')}</p>;
}

export function SearchPage() {
  return (
    <Routes>
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}
