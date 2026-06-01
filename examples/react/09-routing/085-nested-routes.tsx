/**
 * 085 — Nested routes
 * @tags router
 * @difficulty medium
 *
 * ## Теория
 * Outlet рендерит дочерний route. Layout route оборачивает children.
 *
 * ## На собеседовании
 * - nested routes benefit? — Shared layout, code splitting по секциям.
 */

import { Outlet, Route, Routes } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="stats" element={<p>Stats panel</p>} />
      </Route>
    </Routes>
  );
}
