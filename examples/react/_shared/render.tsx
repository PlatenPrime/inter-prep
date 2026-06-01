import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

type ProviderOptions = {
  route?: string;
  withQuery?: boolean;
  withRouter?: boolean;
};

function wrapWithProviders(ui: ReactElement, options?: ProviderOptions): ReactNode {
  const { route = '/', withQuery = false, withRouter = false } = options ?? {};
  let tree: ReactNode = ui;

  if (withRouter) {
    tree = <MemoryRouter initialEntries={[route]}>{tree}</MemoryRouter>;
  }
  if (withQuery) {
    const client = createTestQueryClient();
    tree = <QueryClientProvider client={client}>{tree}</QueryClientProvider>;
  }

  return tree;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & ProviderOptions,
) {
  const { route, withQuery, withRouter, ...renderOptions } = options ?? {};
  return render(wrapWithProviders(ui, { route, withQuery, withRouter }) as ReactElement, renderOptions);
}
