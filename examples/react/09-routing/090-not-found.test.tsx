import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { NotFoundApp } from './090-not-found.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/missing' });
}

describe('090-not-found', () => {
  it('shows not found', () => {
      renderUi(<NotFoundApp />);
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
});
