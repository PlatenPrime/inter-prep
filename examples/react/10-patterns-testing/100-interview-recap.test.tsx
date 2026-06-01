import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecapApp } from './100-interview-recap.tsx';

describe('100-interview-recap', () => {
  it('filters skills', async () => {
      const user = userEvent.setup();
      render(<RecapApp />);
      expect(screen.getByTestId('count')).toHaveTextContent('4 shown');
      await user.type(screen.getByLabelText('Filter skills'), 'react');
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('1 shown');
    });
});
