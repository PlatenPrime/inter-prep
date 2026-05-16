export function darkClass(className: string): string {
  return className
    .split(/\s+/)
    .filter(Boolean)
    .map((c) => `dark:${c}`)
    .join(' ');
}