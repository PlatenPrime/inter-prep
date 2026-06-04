/**
 * Кратко: Проверяем кратность 15, затем 3 и 5.
 */
export function fizzbuzz(n) {
  return Array.from({ length: n }, (_, i) => {
    const x = i + 1;
    if (x % 15 === 0) return 'FizzBuzz';
    if (x % 3 === 0) return 'Fizz';
    if (x % 5 === 0) return 'Buzz';
    return String(x);
  });
}
