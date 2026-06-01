/**
 * 079 — Pagination query
 * @tags tanstack-query
 * @difficulty hard
 *
 * ## Теория
 * queryKey включает page. keepPreviousData / placeholderData для плавного UI.
 *
 * ## На собеседовании
 * - infinite query vs pagination? — useInfiniteQuery для ленты.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchPage(page: number) {
  return { items: [`item-${page}`] };
}

export function PageList() {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ['page', page],
    queryFn: () => fetchPage(page),
  });
  return (
    <div>
      <p data-testid="item">{data?.items[0]}</p>
      <button type="button" onClick={() => setPage((p) => p + 1)}>
        Next
      </button>
    </div>
  );
}
