export function mergeProps<A extends object, B extends object>(base: A, override: B): A & B {
  return { ...base, ...override };
}