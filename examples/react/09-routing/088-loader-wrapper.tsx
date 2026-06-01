/**
 * 088 — Loader wrapper
 * @tags router, data
 * @difficulty hard
 *
 * ## Теория
 * Data routers (RR 6.4+) — loader до render. В тестах имитируйте wrapper с useEffect fetch.
 *
 * ## На собеседовании
 * - loader vs useEffect fetch? — Loader параллелен navigation, меньше waterfall.
 */

import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

function DataView() {
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    setData('loaded');
  }, []);
  return <p>{data ?? 'loading'}</p>;
}

export function DataRoute() {
  return (
    <Routes>
      <Route path="/data" element={<DataView />} />
    </Routes>
  );
}
