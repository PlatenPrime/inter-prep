/**
 * 072 — useQuery error
 * @tags tanstack-query
 * @difficulty medium
 *
 * ## Теория
 * isError и error при rejected queryFn. retry: false в тестах.
 *
 * ## На собеседовании
 * - throw vs return error? — throw в queryFn помечает query failed.
 */

import { useQuery } from '@tanstack/react-query';

export function FailQuery() {
  const { isError } = useQuery({
    queryKey: ['fail'],
    queryFn: () => Promise.reject(new Error('nope')),
    retry: false,
  });
  return <p>{isError ? 'Failed' : 'OK'}</p>;
}
