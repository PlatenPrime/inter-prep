/**
 * Кратко: Обёртка с callback последним аргументом (err, result).
 */
export function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}
