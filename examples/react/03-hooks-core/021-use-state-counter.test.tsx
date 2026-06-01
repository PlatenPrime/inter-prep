import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './021-use-state-counter.tsx';

describe('021-use-state-counter', () => {
  it('increments', async () => {
      const user = userEvent.setup();
      render(<Counter />);
      await user.click(screen.getByRole('button', { name: 'Inc' }));
      expect(screen.getByTestId('n')).toHaveTextContent('1');
    });
});
