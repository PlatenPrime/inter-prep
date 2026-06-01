import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { UserRoute } from './083-url-params.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/users/42' });
}

describe('083-url-params', () => {
  it('shows user id', () => {
      renderUi(<UserRoute />);
      expect(screen.getByText('User 42')).toBeInTheDocument();
    });
});
