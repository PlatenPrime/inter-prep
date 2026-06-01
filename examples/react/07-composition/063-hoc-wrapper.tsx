/**
 * 063 — HOC wrapper
 * @tags patterns, hoc
 * @difficulty medium
 *
 * ## Теория
 * HOC: функция (Component) => WrappedComponent. Добавляет props или behavior.
 *
 * ## На собеседовании
 * - HOC vs hooks? — Hooks заменили большинство HOC.
 */

function Loading() {
  return <p>Loading…</p>;
}

export function withLoading<P extends object>(
  Wrapped: React.ComponentType<P>,
) {
  return function WithLoading(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    if (loading) return <Loading />;
    return <Wrapped {...(rest as P)} />;
  };
}

function Content({ text }: { text: string }) {
  return <p>{text}</p>;
}

export const ContentWithLoading = withLoading(Content);
