import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './038-controlled-modal.tsx';

describe('038-controlled-modal', () => {
  it('closes modal', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose}>
          <p>Body</p>
        </Modal>,
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalled();
    });
});
