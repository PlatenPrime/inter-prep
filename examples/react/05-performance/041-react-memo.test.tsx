import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoChild } from './041-react-memo.tsx';

describe('041-react-memo', () => {
  it('keeps static child label', async () => {
      const user = userEvent.setup();
      render(<MemoChild />);
      await user.click(screen.getByRole('button', { name: 'Inc parent' }));
      expect(screen.getByTestId('child')).toHaveTextContent('static');
      expect(screen.getByTestId('n')).toHaveTextContent('1');
    });
});
