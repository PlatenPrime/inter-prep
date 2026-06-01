import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValidHooks } from './030-hooks-order-valid.tsx';

describe('030-hooks-order-valid', () => {
  it('updates count and extra', async () => {
      const user = userEvent.setup();
      render(<ValidHooks showExtra />);
      await user.click(screen.getByRole('button', { name: '+' }));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('extra')).toHaveTextContent('2');
    });
});
