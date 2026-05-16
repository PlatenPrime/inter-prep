export function stripBrand<T extends object>(obj: T): T {
  return { ...obj };
}