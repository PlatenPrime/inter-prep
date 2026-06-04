/**
 * Кратко: Первый fulfilled или rejected — как race, но иногда фильтруют только resolve.
 */
export function settleFirst(promises) {
  return promiseAny(promises);
}

function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (!arr.length) return reject(new AggregateError([], 'All rejected'));
    const errors = [];
    let rejected = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (e) => {
        errors[i] = e;
        if (++rejected === arr.length) reject(new AggregateError(errors));
      });
    });
  });
}
