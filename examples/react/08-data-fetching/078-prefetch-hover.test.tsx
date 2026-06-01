import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrefetchLink } from './078-prefetch-hover.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('078-prefetch-hover', () => {
  it('renders button', async () => {
      const user = userEvent.setup();
      renderUi(<PrefetchLink />);
      await user.hover(screen.getByRole('button', { name: 'Hover me' }));
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
