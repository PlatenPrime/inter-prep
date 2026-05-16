type Req = { body?: unknown };
type Res = { json: (body: unknown) => void; status?: (code: number) => Res };

/**
 * @param handler
 */
export function wrapHandler(
  handler: (req: Req, res: Res) => void | Promise<void>,
): (req: Req, res: Res) => Promise<void> {
  throw new Error('Not implemented');
}