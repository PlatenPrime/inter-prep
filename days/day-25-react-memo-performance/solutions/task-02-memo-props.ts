export function memoProps<D extends object, P extends object>(defaults: D, props: P): D & P {
  return { ...defaults, ...props };
}