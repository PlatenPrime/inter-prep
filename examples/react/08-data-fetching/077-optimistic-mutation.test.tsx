import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { OptimisticTodo } from './077-optimistic-mutation.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('077-optimistic-mutation', () => {
  it('adds optimistically', async () => {
      const user = userEvent.setup();
      renderUi(<OptimisticTodo />);
      await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument());
      await user.click(screen.getByRole('button', { name: 'Add' }));
      expect(screen.getByText('b')).toBeInTheDocument();
    });
});
