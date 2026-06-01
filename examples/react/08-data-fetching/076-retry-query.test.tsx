import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { RetryQuery } from './076-retry-query.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('076-retry-query', () => {
  it('retries then ok', async () => {
      renderUi(<RetryQuery />);
      await waitFor(() => expect(screen.getByTestId('d')).toHaveTextContent('ok'));
    });
});
