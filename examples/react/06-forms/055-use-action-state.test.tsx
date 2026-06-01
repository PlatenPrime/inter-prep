import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { ActionForm } from './055-use-action-state.tsx';

describe('055-use-action-state', () => {
  it('saves via action', async () => {
      const user = userEvent.setup();
      render(<ActionForm />);
      await user.type(screen.getByLabelText('Name'), 'Ada');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(await screen.findByText('Saved: Ada')).toBeInTheDocument();
    });
});
