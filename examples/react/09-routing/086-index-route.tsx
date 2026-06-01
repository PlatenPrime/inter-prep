/**
 * 086 — Index route
 * @tags router
 * @difficulty medium
 *
 * ## Теория
 * index route — default child при точном match родителя.
 *
 * ## На собеседовании
 * - index vs path=""? — index для default child.
 */

import { Route, Routes } from 'react-router-dom';

export function ShopRoutes() {
  return (
    <Routes>
      <Route path="/shop">
        <Route index element={<p>Shop home</p>} />
        <Route path="cart" element={<p>Cart</p>} />
      </Route>
    </Routes>
  );
}
