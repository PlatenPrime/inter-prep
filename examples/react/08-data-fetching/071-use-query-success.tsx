/**
 * 071 — useQuery success
 * @tags tanstack-query
 * @difficulty medium
 *
 * ## Теория
 * useQuery кеширует по queryKey, управляет loading/error/data.
 *
 * ## На собеседовании
 * - queryKey? — Сериализуемый массив идентификаторов кеша.
 */

import { useQuery } from '@tanstack/react-query';

async function fetchUser() {
  return { name: 'Ada' };
}

export function UserQuery() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  if (isLoading) return <p>Loading</p>;
  if (isError) return <p>Error</p>;
  return <p>{data?.name}</p>;
}
