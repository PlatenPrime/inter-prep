/**
 * Кратко: Ограничение одновременных async задач: семафор + очередь.
 */
export function createPool(limit) {
  let active = 0;
  const queue = [];
  async function runNext() {
    if (active >= limit || !queue.length) return;
    active++;
    const { task, resolve, reject } = queue.shift();
    try {
      resolve(await task());
    } catch (e) {
      reject(e);
    } finally {
      active--;
      runNext();
    }
  }
  return {
    run(task) {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        runNext();
      });
    },
  };
}
