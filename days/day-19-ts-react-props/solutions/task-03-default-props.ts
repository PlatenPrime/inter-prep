export function defaultProps<T extends object, D extends Partial<T>>(props: T, defaults: D): T & D {
  return { ...defaults, ...props };
}