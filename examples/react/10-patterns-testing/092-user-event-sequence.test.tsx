import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinForm } from './092-user-event-sequence.tsx';

describe('092-user-event-sequence', () => {
  it('accepts 4 digit pin', async () => {
      const user = userEvent.setup();
      render(<PinForm />);
      await user.type(screen.getByLabelText('PIN'), '1234');
      expect(screen.getByText('OK')).toBeInTheDocument();
    });
});
