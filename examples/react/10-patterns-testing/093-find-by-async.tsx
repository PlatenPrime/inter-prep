/**
 * 093 — findBy async
 * @tags testing, async
 * @difficulty medium
 *
 * ## Теория
 * findBy* ждёт появления элемента (async). waitFor — произвольное условие.
 *
 * ## На собеседовании
 * - findBy vs waitFor? — findBy для элемента, waitFor для assert.
 */

import { useEffect, useState } from 'react';

export function AsyncMessage({ delay = 50 }: { delay?: number }) {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setMsg('Ready'), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return <p>{msg || 'Waiting'}</p>;
}
