export function looksLikeSqli(input: string): boolean {
  return /('|--|;|union\s+select)/i.test(input);
}
