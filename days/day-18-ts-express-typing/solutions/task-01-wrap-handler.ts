type Req = { body?: unknown };
type Res = { json: (body: unknown) => void; status?: (code: number) => Res };

export function wrapHandler(
  handler: (req: Req, res: Res) => void | Promise<void>,
): (req: Req, res: Res) => Promise<void> {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      res.json?.({ error: e instanceof Error ? e.message : String(e) });
    }
  };
}