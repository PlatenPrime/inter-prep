/**
 * 065 — Merge refs
 * @tags refs
 * @difficulty hard
 *
 * ## Теория
 * Несколько ref (callback + object) объединяют в один callback ref.
 *
 * ## На собеседовании
 * - useMergeRefs в UI libs? — Radix, react-merge-refs.
 */

import { useRef, useCallback } from 'react';

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export function MergedInput({ label }: { label: string }) {
  const inner = useRef<HTMLInputElement>(null);
  const setRef = useCallback(mergeRefs(inner), []);
  return (
    <label>
      {label}
      <input ref={setRef} />
    </label>
  );
}
