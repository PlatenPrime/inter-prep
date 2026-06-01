import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FullName } from './032-derived-state.tsx';

describe('032-derived-state', () => {
  it('derives full name', async () => {
      const user = userEvent.setup();
      render(<FullName />);
      await user.type(screen.getByLabelText('First'), 'Ada');
      await user.type(screen.getByLabelText('Last'), 'Lovelace');
      expect(screen.getByTestId('full')).toHaveTextContent('Ada Lovelace');
    });
});
