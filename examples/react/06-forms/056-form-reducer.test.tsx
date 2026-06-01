import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from './056-form-reducer.tsx';

describe('056-form-reducer', () => {
  it('resets form', async () => {
      const user = userEvent.setup();
      render(<ProfileForm />);
      await user.type(screen.getByLabelText('Name'), 'Ada');
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(screen.getByTestId('name')).toHaveTextContent('');
    });
});
