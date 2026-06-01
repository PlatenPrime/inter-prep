import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../_shared/render.tsx';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { SaveMutation } from './073-use-mutation.tsx';

import type { ReactElement } from 'react';

function renderUi(ui: ReactElement) {
  return renderWithProviders(ui, { withQuery: true });
}

describe('073-use-mutation', () => {
  it('mutates', async () => {
      const user = userEvent.setup();
      renderUi(<SaveMutation />);
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });
});
