import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { DependentFetch } from './080-dependent-queries.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('080-dependent-queries', () => {
  it('loads dependent', async () => {
      renderUi(<DependentFetch />);
      expect(await screen.findByText('post-1')).toBeInTheDocument();
    });
});
