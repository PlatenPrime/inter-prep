/**
 * 076 — Retry query
 * @tags tanstack-query
 * @difficulty medium
 *
 * ## Теория
 * retry и retryDelay настраивают повтор при ошибке сети.
 *
 * ## На собеседовании
 * - retry: false когда? — 4xx кроме 408/429.
 */

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

export function RetryQuery() {
  const attempts = useRef(0);
  const { data, isSuccess } = useQuery({
    queryKey: ['retry'],
    queryFn: async () => {
      attempts.current += 1;
      if (attempts.current < 2) throw new Error('fail');
      return 'ok';
    },
    retry: 2,
    retryDelay: 0,
  });
  return <p data-testid="d">{isSuccess ? data : 'wait'}</p>;
}
