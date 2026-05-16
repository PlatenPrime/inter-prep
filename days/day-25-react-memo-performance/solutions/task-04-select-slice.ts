function sliceShallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const k of keys) {
    if (!Object.is(a[k], b[k])) return false;
  }
  return true;
}

export function selectSlice<T extends object, R extends object>(pick: (state: T) => R) {
  let lastSlice: R | undefined;
  return (state: T): R => {
    const slice = pick(state);
    if (lastSlice !== undefined && sliceShallowEqual(lastSlice as Record<string, unknown>, slice as Record<string, unknown>)) {
      return lastSlice;
    }
    lastSlice = slice;
    return slice;
  };
}