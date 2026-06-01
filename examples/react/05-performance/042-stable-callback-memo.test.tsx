import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StableButton } from './042-stable-callback-memo.tsx';

describe('042-stable-callback-memo', () => {
  it('increments via memo child', async () => {
      const user = userEvent.setup();
      render(<StableButton />);
      await user.click(screen.getByRole('button', { name: 'Click' }));
      expect(screen.getByTestId('n')).toHaveTextContent('1');
    });
});
