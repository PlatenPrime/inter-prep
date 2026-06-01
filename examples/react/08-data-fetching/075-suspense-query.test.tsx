import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { SuspenseUser } from './075-suspense-query.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('075-suspense-query', () => {
  it('suspends then shows', async () => {
      renderUi(<SuspenseUser />);
      expect(await screen.findByText('Grace')).toBeInTheDocument();
    });
});
