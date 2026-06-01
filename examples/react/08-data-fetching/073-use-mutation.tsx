/**
 * 073 — useMutation
 * @tags tanstack-query
 * @difficulty medium
 *
 * ## Теория
 * useMutation для POST/PUT. onSuccess может invalidateQueries.
 *
 * ## На собеседовании
 * - mutation vs query? — Запись vs чтение.
 */

import { useMutation } from '@tanstack/react-query';

export function SaveMutation() {
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 10));
      return 'saved';
    },
  });
  return (
    <div>
      <button type="button" onClick={() => mutate()} disabled={isPending}>
        Save
      </button>
      {isSuccess && <p>Saved</p>}
    </div>
  );
}
