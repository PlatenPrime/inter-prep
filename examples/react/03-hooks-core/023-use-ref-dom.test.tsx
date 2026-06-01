import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusInput } from './023-use-ref-dom.tsx';

describe('023-use-ref-dom', () => {
  it('focuses input', async () => {
      const user = userEvent.setup();
      render(<FocusInput />);
      const input = screen.getByLabelText('Name');
      await user.click(screen.getByRole('button', { name: 'Focus' }));
      expect(input).toHaveFocus();
    });
});
