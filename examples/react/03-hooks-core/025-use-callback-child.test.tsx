import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './025-use-callback-child.tsx';

describe('025-use-callback-child', () => {
  it('removes item', async () => {
      const user = userEvent.setup();
      render(<TodoItem />);
      await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]!);
      expect(screen.queryByText('one')).not.toBeInTheDocument();
      expect(screen.getByText('two')).toBeInTheDocument();
    });
});
