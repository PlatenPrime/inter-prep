/**
 * Кратко: Классический pub/sub: subscribe возвращает unsubscribe; publish всем подписчикам topic.
 */
export function createPubSub() {
  const subs = new Map();
  return {
    subscribe(topic, fn) {
      if (!subs.has(topic)) subs.set(topic, new Set());
      subs.get(topic).add(fn);
      return () => subs.get(topic)?.delete(fn);
    },
    publish(topic, data) {
      subs.get(topic)?.forEach((fn) => fn(data));
    },
  };
}
