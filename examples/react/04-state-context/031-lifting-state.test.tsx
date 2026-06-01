import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FahrenheitConverter } from './031-lifting-state.tsx';

describe('031-lifting-state', () => {
  it('increases fahrenheit', async () => {
      const user = userEvent.setup();
      render(<FahrenheitConverter />);
      await user.click(screen.getByRole('button', { name: '+10' }));
      expect(screen.getByTestId('display')).toHaveTextContent('42°F');
    });
});
