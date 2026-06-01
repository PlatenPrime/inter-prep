import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { DataRoute } from './088-loader-wrapper.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/data' });
}

describe('088-loader-wrapper', () => {
  it('loads data', async () => {
      renderUi(<DataRoute />);
      expect(await screen.findByText('loaded')).toBeInTheDocument();
    });
});
