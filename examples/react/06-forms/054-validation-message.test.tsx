import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailForm } from './054-validation-message.tsx';

describe('054-validation-message', () => {
  it('shows error', async () => {
      const user = userEvent.setup();
      render(<EmailForm />);
      await user.type(screen.getByLabelText('Email'), 'bad');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });
});
