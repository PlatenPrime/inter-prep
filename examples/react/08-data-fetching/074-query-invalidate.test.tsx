import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { CounterQuery } from './074-query-invalidate.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('074-query-invalidate', () => {
  it('invalidates count', async () => {
      const user = userEvent.setup();
      renderUi(<CounterQuery />);
      await waitFor(() => expect(screen.getByTestId('c')).toHaveTextContent('0'));
      await user.click(screen.getByRole('button', { name: 'Inc' }));
      await waitFor(() => expect(screen.getByTestId('c')).toHaveTextContent('1'));
    });
});
