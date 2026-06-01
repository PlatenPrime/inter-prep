import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { LazyRoute } from './048-lazy-route-mock.tsx';

describe('048-lazy-route-mock', () => {
  it('loads page b', async () => {
      const user = userEvent.setup();
      render(<LazyRoute />);
      await user.click(screen.getByRole('button', { name: 'Go B' }));
      expect(await screen.findByText('Page B')).toBeInTheDocument();
    });
});
