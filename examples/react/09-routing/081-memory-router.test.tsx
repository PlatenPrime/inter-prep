import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { HomePage } from './081-memory-router.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/' });
}

describe('081-memory-router', () => {
  it('shows home', () => {
      renderUi(<HomePage />);
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    });
});
