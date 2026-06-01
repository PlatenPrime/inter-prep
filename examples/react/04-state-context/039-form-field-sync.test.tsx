import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SyncedFields } from './039-form-field-sync.tsx';

describe('039-form-field-sync', () => {
  it('shows match', async () => {
      const user = userEvent.setup();
      render(<SyncedFields />);
      await user.type(screen.getByLabelText('Email'), 'a@b.co');
      await user.type(screen.getByLabelText('Confirm'), 'a@b.co');
      expect(screen.getByTestId('match')).toHaveTextContent('match');
    });
});
