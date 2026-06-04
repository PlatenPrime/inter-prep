/**
 * Кратко: Очередь задач с задержкой: setTimeout chains или min-heap для многих таймеров.
 */
export function createScheduler() {
  const queue = [];
  let running = false;
  async function drain() {
    if (running) return;
    running = true;
    while (queue.length) {
      const { fn, delayMs } = queue.shift();
      await new Promise((r) => setTimeout(r, delayMs));
      await fn();
    }
    running = false;
  }
  return {
    schedule(fn, delayMs) {
      queue.push({ fn, delayMs });
      drain();
    },
  };
}
