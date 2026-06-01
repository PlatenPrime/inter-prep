/**
 * 083 — URL params
 * @tags router
 * @difficulty medium
 *
 * ## Теория
 * useParams читает :id из path. Типизируйте params в TypeScript.
 *
 * ## На собеседовании
 * - optional params? — :id? в path pattern.
 */

import { Route, Routes, useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  return <p>User {id}</p>;
}

export function UserRoute() {
  return (
    <Routes>
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}
