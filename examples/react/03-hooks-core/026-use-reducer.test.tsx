import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from './026-use-reducer.tsx';

describe('026-use-reducer', () => {
  it('steps and resets', async () => {
      const user = userEvent.setup();
      render(<Stepper />);
      await user.click(screen.getByRole('button', { name: 'Next' }));
      expect(screen.getByTestId('step')).toHaveTextContent('1');
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      expect(screen.getByTestId('step')).toHaveTextContent('0');
    });
});
