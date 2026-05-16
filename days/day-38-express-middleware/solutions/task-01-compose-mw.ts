export function composeMiddleware(mw: Array<(req: unknown, next: () => void) => void>) {
  return (req: unknown) => {
    let i = 0;
    const run = () => { if (i < mw.length) mw[i++](req, run); };
    run();
  };
}
