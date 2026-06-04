/**
 * Кратко: Ждём все промисы; один reject ломает всё.
 */
export function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (arr.length === 0) return resolve([]);
    const results = new Array(arr.length);
    let settled = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          results[i] = v;
          if (++settled === arr.length) resolve(results);
        },
        reject,
      );
    });
  });
}
