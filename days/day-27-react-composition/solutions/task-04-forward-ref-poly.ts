type Ref<R> = ((instance: R | null) => void) | { current: R | null } | null;

export function forwardRefPoly<P extends object, R>(props: P, ref: Ref<R>): P & { ref: Ref<R> } {
  return { ...props, ref };
}