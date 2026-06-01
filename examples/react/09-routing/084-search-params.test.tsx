import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { SearchPage } from './084-search-params.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/search?q=react' });
}

describe('084-search-params', () => {
  it('reads q param', () => {
      renderUi(<SearchPage />);
      expect(screen.getByText('Query: react')).toBeInTheDocument();
    });
});
