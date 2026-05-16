type Ctx = { done?: boolean };
type Middleware = (ctx: Ctx, next: () => void | Promise<void>) => void | Promise<void>;

export function middlewareChain(middlewares: Middleware[]): (ctx: Ctx) => Promise<void> {
  return async (ctx) => {
    let index = 0;
    const run = async (): Promise<void> => {
      if (ctx.done || index >= middlewares.length) return;
      const mw = middlewares[index++];
      await mw(ctx, run);
    };
    await run();
  };
}