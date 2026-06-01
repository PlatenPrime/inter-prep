import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefForm } from './009-uncontrolled-ref.tsx';

describe('009-uncontrolled-ref', () => {
  it('submits email from ref', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<RefForm onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText('Email'), 'a@b.co');
      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(onSubmit).toHaveBeenCalledWith('a@b.co');
    });
});
