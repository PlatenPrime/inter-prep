/**
 * Кратко: Очередь lock: пока locked, ждём; release передаёт следующему.
 */
export function createMutex() {
  let locked = false;
  const waiters = [];
  return {
    async acquire() {
      if (!locked) {
        locked = true;
        return;
      }
      await new Promise((resolve) => waiters.push(resolve));
      locked = true;
    },
    release() {
      const next = waiters.shift();
      if (next) next();
      else locked = false;
    },
  };
}
