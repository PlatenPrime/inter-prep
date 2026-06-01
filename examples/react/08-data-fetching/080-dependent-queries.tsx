/**
 * 080 — Dependent queries
 * @tags tanstack-query
 * @difficulty hard
 *
 * ## Теория
 * enabled: !!userId — второй query ждёт первый.
 *
 * ## На собеседовании
 * - dependent queries? — enabled flag от результата предыдущего.
 */

import { useQuery } from '@tanstack/react-query';

export function DependentFetch() {
  const user = useQuery({
    queryKey: ['u'],
    queryFn: async () => ({ id: '1' }),
  });
  const posts = useQuery({
    queryKey: ['posts', user.data?.id],
    queryFn: async () => ['post-1'],
    enabled: !!user.data?.id,
  });
  if (user.isLoading || posts.isLoading) return <p>Loading</p>;
  return <p>{posts.data?.[0]}</p>;
}
