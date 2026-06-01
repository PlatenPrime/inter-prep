import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartTotal } from './035-selector-hook.tsx';

describe('035-selector-hook', () => {
  it('updates total', async () => {
      const user = userEvent.setup();
      render(<CartTotal />);
      expect(screen.getByTestId('total')).toHaveTextContent('15');
      await user.click(screen.getByRole('button', { name: 'Add' }));
      expect(screen.getByTestId('total')).toHaveTextContent('18');
    });
});
