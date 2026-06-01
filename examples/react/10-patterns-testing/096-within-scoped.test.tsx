import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';
import { TwoCards } from './096-within-scoped.tsx';

describe('096-within-scoped', () => {
  it('clicks buy in card A', async () => {
      const user = userEvent.setup();
      render(<TwoCards />);
      const cardA = screen.getByRole('article', { name: 'Card A' });
      await user.click(within(cardA).getByRole('button', { name: 'Buy' }));
      expect(cardA).toBeInTheDocument();
    });
});
