/**
 * 087 — Protected route
 * @tags router, auth
 * @difficulty hard
 *
 * ## Теория
 * Guard component: если !auth — Navigate to /login, иначе children.
 *
 * ## На собеседовании
 * - loader vs client guard? — Loader на сервере надёжнее для секретов.
 */

import { Navigate, Route, Routes } from 'react-router-dom';

function Guard({ auth, children }: { auth: boolean; children: React.ReactNode }) {
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}

export function ProtectedApp({ auth }: { auth: boolean }) {
  return (
    <Routes>
      <Route path="/login" element={<p>Login</p>} />
      <Route
        path="/secret"
        element={
          <Guard auth={auth}>
            <p>Secret</p>
          </Guard>
        }
      />
    </Routes>
  );
}
