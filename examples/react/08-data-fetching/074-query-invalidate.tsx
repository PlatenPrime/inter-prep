/**
 * 074 — Invalidate queries
 * @tags tanstack-query
 * @difficulty hard
 *
 * ## Теория
 * queryClient.invalidateQueries обновляет stale queries после mutation.
 *
 * ## На собеседовании
 * - invalidate vs refetch? — invalidate помечает stale, refetch активный.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

let count = 0;

export function CounterQuery() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['count'],
    queryFn: async () => count,
  });
  const { mutate } = useMutation({
    mutationFn: async () => {
      count += 1;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['count'] }),
  });
  return (
    <div>
      <span data-testid="c">{data}</span>
      <button type="button" onClick={() => mutate()}>
        Inc
      </button>
    </div>
  );
}
