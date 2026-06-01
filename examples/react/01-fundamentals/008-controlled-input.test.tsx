import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NameField } from './008-controlled-input.tsx';

describe('008-controlled-input', () => {
  it('updates char count', async () => {
      const user = userEvent.setup();
      render(<NameField />);
      await user.type(screen.getByRole('textbox'), 'abc');
      expect(screen.getByText('3 chars')).toBeInTheDocument();
    });
});
