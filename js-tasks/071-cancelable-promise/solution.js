/**
 * Кратко: Возвращаем promise + cancel(), reject при отмене.
 */
export function cancelablePromise(executor) {
  let reject;
  const promise = new Promise((res, rej) => {
    reject = rej;
    executor(res, rej);
  });
  return {
    promise,
    cancel() {
      reject(new Error('Cancelled'));
    },
  };
}
