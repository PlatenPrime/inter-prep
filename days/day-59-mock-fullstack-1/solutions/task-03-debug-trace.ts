export function findFailingTrace(steps: { name: string; ok: boolean }[]): string | null {
  const bad = steps.find((s) => !s.ok);
  return bad?.name ?? null;
}
