import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { FailQuery } from './072-use-query-error.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('072-use-query-error', () => {
  it('shows failed', async () => {
      renderUi(<FailQuery />);
      expect(await screen.findByText('Failed')).toBeInTheDocument();
    });
});
