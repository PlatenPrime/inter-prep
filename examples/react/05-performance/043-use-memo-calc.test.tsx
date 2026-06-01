import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpensiveSum } from './043-use-memo-calc.tsx';

describe('043-use-memo-calc', () => {
  it('sums to n', () => {
      render(<ExpensiveSum n={5} />);
      expect(screen.getByTestId('total')).toHaveTextContent('15');
    });
});
