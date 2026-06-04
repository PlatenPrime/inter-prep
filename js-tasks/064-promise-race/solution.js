/**
 * Кратко: Первый settled (resolve или reject) побеждает.
 */
export function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const p of iterable) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}
