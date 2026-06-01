/**
 * 077 — Optimistic mutation
 * @tags tanstack-query
 * @difficulty hard
 *
 * ## Теория
 * onMutate обновляет кеш до ответа; onError откатывает.
 *
 * ## На собеседовании
 * - optimistic updates flow? — cancelQueries, snapshot, rollback.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function OptimisticTodo() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => ['a'],
  });
  const { mutate } = useMutation({
    mutationFn: async (item: string) => {
      await new Promise((r) => setTimeout(r, 10));
      return item;
    },
    onMutate: async (item) => {
      await qc.cancelQueries({ queryKey: ['todos'] });
      const prev = qc.getQueryData<string[]>(['todos']);
      qc.setQueryData(['todos'], [...(prev ?? []), item]);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(['todos'], ctx?.prev);
    },
  });
  return (
    <div>
      <ul>
        {data.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <button type="button" onClick={() => mutate('b')}>
        Add
      </button>
    </div>
  );
}
