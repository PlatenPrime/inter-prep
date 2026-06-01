import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilteredList } from './024-use-memo-expensive.tsx';

describe('024-use-memo-expensive', () => {
  it('filters items', async () => {
      const user = userEvent.setup();
      render(<FilteredList items={['apple', 'banana']} />);
      await user.type(screen.getByLabelText('Filter'), 'ban');
      expect(screen.getByText('banana')).toBeInTheDocument();
      expect(screen.queryByText('apple')).not.toBeInTheDocument();
    });
});
