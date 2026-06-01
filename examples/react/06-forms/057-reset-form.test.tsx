import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResettableForm } from './057-reset-form.tsx';

describe('057-reset-form', () => {
  it('clears field', async () => {
      const user = userEvent.setup();
      render(<ResettableForm />);
      await user.type(screen.getByLabelText('Field'), 'x');
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(screen.getByLabelText('Field')).toHaveValue('');
    });
});
