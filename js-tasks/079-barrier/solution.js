/**
 * Кратко: N async задач должны завершиться, затем общий callback/Promise.
 */
export function createBarrier(count) {
  let arrived = 0;
  let resolveAll;
  const promise = new Promise((r) => { resolveAll = r; });
  return {
    async await() {
      arrived++;
      if (arrived >= count) resolveAll();
      return promise;
    },
  };
}
