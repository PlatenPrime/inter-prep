import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleDemo } from './028-custom-hook-toggle.tsx';

describe('028-custom-hook-toggle', () => {
  it('toggles', async () => {
      const user = userEvent.setup();
      render(<ToggleDemo />);
      await user.click(screen.getByRole('button', { name: 'Off' }));
      expect(screen.getByRole('button', { name: 'On' })).toBeInTheDocument();
    });
});
