import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptimisticLike } from './037-optimistic-toggle.tsx';

describe('037-optimistic-toggle', () => {
  it('optimistically likes', async () => {
      const user = userEvent.setup();
      const save = vi.fn().mockResolvedValue(undefined);
      render(<OptimisticLike save={save} />);
      await user.click(screen.getByRole('button', { name: 'Like' }));
      expect(screen.getByRole('button', { name: 'Liked' })).toBeInTheDocument();
      expect(save).toHaveBeenCalledWith(true);
    });
});
