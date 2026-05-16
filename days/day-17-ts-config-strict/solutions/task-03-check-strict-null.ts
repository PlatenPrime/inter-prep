export function checkStrictNull(expr: string): boolean {
  return /[a-zA-Z0-9_$].[a-zA-Z0-9_$]/.test(expr) && !expr.includes('?.');
}