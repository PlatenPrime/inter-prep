/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 71,
    slug: 'use-query-success',
    folder: '08-data-fetching',
    title: 'useQuery success',
    tags: ['tanstack-query'],
    difficulty: 'medium',
    exportName: 'UserQuery',
    withQuery: true,
    theory: `useQuery кеширует по queryKey, управляет loading/error/data.`,
    interview: `- queryKey? — Сериализуемый массив идентификаторов кеша.`,
    component: `import { useQuery } from '@tanstack/react-query';

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
}`,
    test: `it('loads user', async () => {
    renderUi(<UserQuery />);
    expect(await screen.findByText('Ada')).toBeInTheDocument();
  });`,
  },
  {
    num: 72,
    slug: 'use-query-error',
    folder: '08-data-fetching',
    title: 'useQuery error',
    tags: ['tanstack-query'],
    difficulty: 'medium',
    exportName: 'FailQuery',
    withQuery: true,
    theory: `isError и error при rejected queryFn. retry: false в тестах.`,
    interview: `- throw vs return error? — throw в queryFn помечает query failed.`,
    component: `import { useQuery } from '@tanstack/react-query';

export function FailQuery() {
  const { isError } = useQuery({
    queryKey: ['fail'],
    queryFn: () => Promise.reject(new Error('nope')),
    retry: false,
  });
  return <p>{isError ? 'Failed' : 'OK'}</p>;
}`,
    test: `it('shows failed', async () => {
    renderUi(<FailQuery />);
    expect(await screen.findByText('Failed')).toBeInTheDocument();
  });`,
  },
  {
    num: 73,
    slug: 'use-mutation',
    folder: '08-data-fetching',
    title: 'useMutation',
    tags: ['tanstack-query'],
    difficulty: 'medium',
    exportName: 'SaveMutation',
    withQuery: true,
    theory: `useMutation для POST/PUT. onSuccess может invalidateQueries.`,
    interview: `- mutation vs query? — Запись vs чтение.`,
    component: `import { useMutation } from '@tanstack/react-query';

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
}`,
    test: `it('mutates', async () => {
    const user = userEvent.setup();
    renderUi(<SaveMutation />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });`,
  },
  {
    num: 74,
    slug: 'query-invalidate',
    folder: '08-data-fetching',
    title: 'Invalidate queries',
    tags: ['tanstack-query'],
    difficulty: 'hard',
    exportName: 'CounterQuery',
    withQuery: true,
    theory: `queryClient.invalidateQueries обновляет stale queries после mutation.`,
    interview: `- invalidate vs refetch? — invalidate помечает stale, refetch активный.`,
    component: `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

let count = 0;

export function CounterQuery() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['count'],
    queryFn: async () => count,
  });
  const { mutate } = useMutation({
    mutationFn: async () => {
      count += 1;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['count'] }),
  });
  return (
    <div>
      <span data-testid="c">{data}</span>
      <button type="button" onClick={() => mutate()}>
        Inc
      </button>
    </div>
  );
}`,
    test: `it('invalidates count', async () => {
    const user = userEvent.setup();
    renderUi(<CounterQuery />);
    await waitFor(() => expect(screen.getByTestId('c')).toHaveTextContent('0'));
    await user.click(screen.getByRole('button', { name: 'Inc' }));
    await waitFor(() => expect(screen.getByTestId('c')).toHaveTextContent('1'));
  });`,
  },
  {
    num: 75,
    slug: 'suspense-query',
    folder: '08-data-fetching',
    title: 'Suspense query',
    tags: ['tanstack-query', 'suspense'],
    difficulty: 'hard',
    exportName: 'SuspenseUser',
    withQuery: true,
    theory: `useSuspenseQuery бросает promise в Suspense boundary до resolve.`,
    interview: `- suspense query on server? — Streaming SSR с React Query.`,
    component: `import { Suspense } from 'react';
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
}`,
    test: `it('suspends then shows', async () => {
    renderUi(<SuspenseUser />);
    expect(await screen.findByText('Grace')).toBeInTheDocument();
  });`,
  },
  {
    num: 76,
    slug: 'retry-query',
    folder: '08-data-fetching',
    title: 'Retry query',
    tags: ['tanstack-query'],
    difficulty: 'medium',
    exportName: 'RetryQuery',
    withQuery: true,
    theory: `retry и retryDelay настраивают повтор при ошибке сети.`,
    interview: `- retry: false когда? — 4xx кроме 408/429.`,
    component: `import { useRef } from 'react';
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
}`,
    test: `it('retries then ok', async () => {
    renderUi(<RetryQuery />);
    await waitFor(() => expect(screen.getByTestId('d')).toHaveTextContent('ok'));
  });`,
  },
  {
    num: 77,
    slug: 'optimistic-mutation',
    folder: '08-data-fetching',
    title: 'Optimistic mutation',
    tags: ['tanstack-query'],
    difficulty: 'hard',
    exportName: 'OptimisticTodo',
    withQuery: true,
    theory: `onMutate обновляет кеш до ответа; onError откатывает.`,
    interview: `- optimistic updates flow? — cancelQueries, snapshot, rollback.`,
    component: `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
}`,
    test: `it('adds optimistically', async () => {
    const user = userEvent.setup();
    renderUi(<OptimisticTodo />);
    await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('b')).toBeInTheDocument();
  });`,
  },
  {
    num: 78,
    slug: 'prefetch-hover',
    folder: '08-data-fetching',
    title: 'Prefetch on hover',
    tags: ['tanstack-query'],
    difficulty: 'medium',
    exportName: 'PrefetchLink',
    withQuery: true,
    theory: `queryClient.prefetchQuery загружает данные до клика.`,
    interview: `- prefetchQuery когда? — Hover на ссылку, видимость в viewport.`,
    component: `import { useQueryClient } from '@tanstack/react-query';

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
}`,
    test: `it('renders button', async () => {
    const user = userEvent.setup();
    renderUi(<PrefetchLink />);
    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(screen.getByRole('button')).toBeInTheDocument();
  });`,
  },
  {
    num: 79,
    slug: 'pagination-query',
    folder: '08-data-fetching',
    title: 'Pagination query',
    tags: ['tanstack-query'],
    difficulty: 'hard',
    exportName: 'PageList',
    withQuery: true,
    theory: `queryKey включает page. keepPreviousData / placeholderData для плавного UI.`,
    interview: `- infinite query vs pagination? — useInfiniteQuery для ленты.`,
    component: `import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchPage(page: number) {
  return { items: [\`item-\${page}\`] };
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
}`,
    test: `it('loads next page', async () => {
    const user = userEvent.setup();
    renderUi(<PageList />);
    await waitFor(() => expect(screen.getByTestId('item')).toHaveTextContent('item-1'));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByTestId('item')).toHaveTextContent('item-2'));
  });`,
  },
  {
    num: 80,
    slug: 'dependent-queries',
    folder: '08-data-fetching',
    title: 'Dependent queries',
    tags: ['tanstack-query'],
    difficulty: 'hard',
    exportName: 'DependentFetch',
    withQuery: true,
    theory: `enabled: !!userId — второй query ждёт первый.`,
    interview: `- dependent queries? — enabled flag от результата предыдущего.`,
    component: `import { useQuery } from '@tanstack/react-query';

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
}`,
    test: `it('loads dependent', async () => {
    renderUi(<DependentFetch />);
    expect(await screen.findByText('post-1')).toBeInTheDocument();
  });`,
  },
];
