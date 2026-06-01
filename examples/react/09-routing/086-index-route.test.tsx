import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { ShopRoutes } from './086-index-route.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/shop' });
}

describe('086-index-route', () => {
  it('shows shop home', () => {
      renderUi(<ShopRoutes />);
      expect(screen.getByText('Shop home')).toBeInTheDocument();
    });
});
