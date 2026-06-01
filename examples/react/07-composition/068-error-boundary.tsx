/**
 * 068 — Error boundary
 * @tags errors
 * @difficulty hard
 *
 * ## Теория
 * Class component getDerivedStateFromError / componentDidCatch ловит ошибки рендера детей.
 *
 * ## На собеседовании
 * - Functional Error Boundary? — Пока только class или react-error-boundary lib.
 */

import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function Boom() {
  throw new Error('boom');
}

export function ErrorDemo() {
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Boom />
    </ErrorBoundary>
  );
}
