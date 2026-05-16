type Ctx = { done?: boolean };
type Middleware = (ctx: Ctx, next: () => void | Promise<void>) => void | Promise<void>;

/** @param middlewares */
export function middlewareChain(middlewares: Middleware[]): (ctx: Ctx) => Promise<void> {
  throw new Error('Not implemented');
}