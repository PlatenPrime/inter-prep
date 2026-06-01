import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { UserQuery } from './071-use-query-success.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('071-use-query-success', () => {
  it('loads user', async () => {
      renderUi(<UserQuery />);
      expect(await screen.findByText('Ada')).toBeInTheDocument();
    });
});
