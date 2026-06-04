/**
 * Кратко: Сумма 0.
 */
export function missingNumber(nums) {
  const n = nums.length;
  let sum = (n * (n + 1)) / 2;
  for (const x of nums) sum -= x;
  return sum;
}
