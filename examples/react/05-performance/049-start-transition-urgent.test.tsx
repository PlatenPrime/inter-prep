import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DualInput } from './049-start-transition-urgent.tsx';

describe('049-start-transition-urgent', () => {
  it('updates text and filter', async () => {
      const user = userEvent.setup();
      render(<DualInput />);
      await user.type(screen.getByLabelText('Type'), 're');
      expect(screen.getByTestId('text')).toHaveTextContent('re');
      expect(screen.getByText('react')).toBeInTheDocument();
    });
});
