import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { DashboardRoutes } from './085-nested-routes.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/dashboard/stats' });
}

describe('085-nested-routes', () => {
  it('renders nested stats', () => {
      renderUi(<DashboardRoutes />);
      expect(screen.getByText('Stats panel')).toBeInTheDocument();
    });
});
