import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LikeButton } from './007-event-handler.tsx';

describe('007-event-handler', () => {
  it('toggles like on click', async () => {
      const user = userEvent.setup();
      render(<LikeButton />);
      await user.click(screen.getByRole('button', { name: 'Like' }));
      expect(screen.getByRole('button', { name: 'Liked' })).toHaveAttribute('aria-pressed', 'true');
    });
});
