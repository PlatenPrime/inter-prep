import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import { ProtectedApp } from './087-protected-route.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/secret' });
}

describe('087-protected-route', () => {
  it('redirects when logged out', () => {
      renderUi(<ProtectedApp auth={false} />);
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
});
