/**
 * Кратко: Никогда не reject: массив { status, value|reason }.
 */
export function promiseAllSettled(iterable) {
  return Promise.all(
    [...iterable].map((p) =>
      Promise.resolve(p)
        .then((value) => ({ status: 'fulfilled', value }))
        .catch((reason) => ({ status: 'rejected', reason })),
    ),
  );
}
