import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { PageList } from './079-pagination-query.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('079-pagination-query', () => {
  it('loads next page', async () => {
      const user = userEvent.setup();
      renderUi(<PageList />);
      await waitFor(() => expect(screen.getByTestId('item')).toHaveTextContent('item-1'));
      await user.click(screen.getByRole('button', { name: 'Next' }));
      await waitFor(() => expect(screen.getByTestId('item')).toHaveTextContent('item-2'));
    });
});
