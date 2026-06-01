import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TogglePanel } from './012-conditional-mount.tsx';

describe('012-conditional-mount', () => {
  it('mounts panel on toggle', async () => {
      const user = userEvent.setup();
      render(<TogglePanel />);
      expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Toggle' }));
      expect(screen.getByText('Panel content')).toBeInTheDocument();
    });
});
