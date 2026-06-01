import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavApp } from './082-link-navigation.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/' });
}

describe('082-link-navigation', () => {
  it('navigates to about', async () => {
      const user = userEvent.setup();
      renderUi(<NavApp />);
      await user.click(screen.getByRole('link', { name: 'About' }));
      expect(screen.getByText('About page')).toBeInTheDocument();
    });
});
