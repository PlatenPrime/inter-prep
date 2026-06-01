/**
 * 078 — Prefetch on hover
 * @tags tanstack-query
 * @difficulty medium
 *
 * ## Теория
 * queryClient.prefetchQuery загружает данные до клика.
 *
 * ## На собеседовании
 * - prefetchQuery когда? — Hover на ссылку, видимость в viewport.
 */

import { useQueryClient } from '@tanstack/react-query';

export function PrefetchLink() {
  const qc = useQueryClient();
  return (
    <button
      type="button"
      onMouseEnter={() =>
        qc.prefetchQuery({
          queryKey: ['detail'],
          queryFn: async () => 'detail-data',
        })
      }
    >
      Hover me
    </button>
  );
}
