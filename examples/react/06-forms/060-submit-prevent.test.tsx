import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreventSubmit } from './060-submit-prevent.tsx';

describe('060-submit-prevent', () => {
  it('shows sent without reload', async () => {
      const user = userEvent.setup();
      render(<PreventSubmit />);
      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(screen.getByText('Sent')).toBeInTheDocument();
    });
});
