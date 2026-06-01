import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from './097-accessible-name.tsx';

describe('097-accessible-name', () => {
  it('finds by accessible name', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<IconButton onClick={onClick} />);
      await user.click(screen.getByRole('button', { name: 'Close dialog' }));
      expect(onClick).toHaveBeenCalled();
    });
});
