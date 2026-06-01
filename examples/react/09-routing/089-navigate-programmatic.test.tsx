import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoApp } from './089-navigate-programmatic.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withRouter: true, route: '/' });
}

describe('089-navigate-programmatic', () => {
  it('navigates to done', async () => {
      const user = userEvent.setup();
      renderUi(<GoApp />);
      await user.click(screen.getByRole('button', { name: 'Go' }));
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
});
