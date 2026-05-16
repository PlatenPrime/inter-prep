export function parseHealthInterval(cmd: string): number | null {
  const m = cmd.match(/--interval=(\d+)s/);
  return m ? Number(m[1]) : null;
}
