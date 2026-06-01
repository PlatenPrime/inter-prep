import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BatchCounter } from './016-batch-updates.tsx';

describe('016-batch-updates', () => {
  it('increments by 2 in one click', async () => {
      const user = userEvent.setup();
      render(<BatchCounter />);
      await user.click(screen.getByRole('button', { name: '+2' }));
      expect(screen.getByTestId('count')).toHaveTextContent('2');
    });
});
