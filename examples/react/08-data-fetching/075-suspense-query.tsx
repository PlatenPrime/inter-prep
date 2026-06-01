/**
 * 075 — Suspense query
 * @tags tanstack-query, suspense
 * @difficulty hard
 *
 * ## Теория
 * useSuspenseQuery бросает promise в Suspense boundary до resolve.
 *
 * ## На собеседовании
 * - suspense query on server? — Streaming SSR с React Query.
 */

import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

function User() {
  const { data } = useSuspenseQuery({
    queryKey: ['suser'],
    queryFn: async () => ({ name: 'Grace' }),
  });
  return <p>{data.name}</p>;
}

export function SuspenseUser() {
  return (
    <Suspense fallback={<p>Loading user…</p>}>
      <User />
    </Suspense>
  );
}
