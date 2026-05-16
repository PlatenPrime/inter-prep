type Ref<T> = ((instance: T | null) => void) | { current: T | null } | null | undefined;

export function mergeRefs<T>(...refs: Array<Ref<T>>): (instance: T | null) => void {
  return (instance) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(instance);
      else ref.current = instance;
    }
  };
}