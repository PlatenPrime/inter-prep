/**
 * Кратко: Цикл for с шагом step: при step > 0 идём до end (не включая), при отрицательном step — вниз.
 */
export function range(start, end, step = 1) {
  const out = [];
  if (step > 0) for (let i = start; i < end; i += step) out.push(i);
  else for (let i = start; i > end; i += step) out.push(i);
  return out;
}
