/**
 * Кратко: Цепочка sync/async функций: output prev → input next.
 */
export function createPipeline() {
  const middlewares = [];
  return {
    use(fn) { middlewares.push(fn); return this; },
    async run(ctx) {
      let index = 0;
      const next = async () => {
        if (index >= middlewares.length) return ctx;
        const fn = middlewares[index++];
        return fn(ctx, next);
      };
      return next();
    },
  };
}
