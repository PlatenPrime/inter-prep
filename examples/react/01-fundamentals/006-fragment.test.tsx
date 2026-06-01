import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Columns } from './006-fragment.tsx';

describe('006-fragment', () => {
  it('renders two columns without wrapper', () => {
      const { container } = render(<Columns left="A" right="B" />);
      expect(screen.getByTestId('left')).toHaveTextContent('A');
      expect(screen.getByTestId('right')).toHaveTextContent('B');
      expect(container.childElementCount).toBe(2);
    });
});
