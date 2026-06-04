/**
 * Кратко: Алгоритм Бойера–Муре: кандидат + счётчик.
 */
export function majorityElement(nums) {
  let cand = null, count = 0;
  for (const n of nums) {
    if (count === 0) { cand = n; count = 1; }
    else if (n === cand) count++;
    else count--;
  }
  return cand;
}
