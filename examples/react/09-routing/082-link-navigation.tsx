/**
 * 082 — Link navigation
 * @tags router
 * @difficulty easy
 *
 * ## Теория
 * Link предотвращает full reload. NavLink добавляет active class.
 *
 * ## На собеседовании
 * - Link vs a? — Client-side navigation в SPA.
 */

import { Link, Route, Routes } from 'react-router-dom';

export function NavApp() {
  return (
    <>
      <nav>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/about" element={<p>About page</p>} />
      </Routes>
    </>
  );
}
