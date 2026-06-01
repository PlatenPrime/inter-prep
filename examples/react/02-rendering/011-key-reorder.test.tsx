import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReorderList } from './011-key-reorder.tsx';

describe('011-key-reorder', () => {
  it('reverses list order', async () => {
      const user = userEvent.setup();
      render(
        <ReorderList
          items={[
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ]}
        />,
      );
      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('A');
      await user.click(screen.getByRole('button', { name: 'Reverse' }));
      expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('B');
    });
});
