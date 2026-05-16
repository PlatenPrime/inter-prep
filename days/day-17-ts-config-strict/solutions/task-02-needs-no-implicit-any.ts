export function needsNoImplicitAny(code: string): boolean {
  return /function\s+\w+\s*\(\s*[a-zA-Z_$][\w$]*\s*\)/.test(code) && !/function\s+\w+\s*\(\s*[a-zA-Z_$][\w$]*\s*:/.test(code);
}