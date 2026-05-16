export function mergeRefs<T>(...refs: Array<((v: T | null) => void) | { current: T | null } | null>): (v: T | null) => void {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(value);
      else ref.current = value;
    }
  };
}
