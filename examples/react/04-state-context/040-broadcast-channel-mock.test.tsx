import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExternalCounter } from './040-broadcast-channel-mock.tsx';

describe('040-broadcast-channel-mock', () => {
  it('syncs external bump', async () => {
      const user = userEvent.setup();
      render(<ExternalCounter />);
      await user.click(screen.getByRole('button', { name: 'Bump' }));
      expect(screen.getByTestId('v')).toHaveTextContent('1');
    });
});
