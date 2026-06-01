import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StyleBox } from './050-avoid-inline-props.tsx';

describe('050-avoid-inline-props', () => {
  it('applies active color', () => {
      render(<StyleBox active />);
      expect(screen.getByTestId('box')).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    });
});
