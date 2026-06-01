/**
 * 053 — Select controlled
 * @tags forms
 * @difficulty easy
 *
 * ## Теория
 * select value привязан к state. option value — строка.
 *
 * ## На собеседовании
 * - multiple select? — value как массив.
 */

import { useState } from 'react';

export function CountrySelect() {
  const [country, setCountry] = useState('us');
  return (
    <label>
      Country
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="us">US</option>
        <option value="uk">UK</option>
      </select>
      <output data-testid="out">{country}</output>
    </label>
  );
}
