import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualSlice } from './045-virtual-slice.tsx';

describe('045-virtual-slice', () => {
  it('renders slice window', () => {
      render(<VirtualSlice items={['a', 'b', 'c', 'd']} start={1} end={3} />);
      expect(screen.getByText('b')).toBeInTheDocument();
      expect(screen.getByText('c')).toBeInTheDocument();
      expect(screen.queryByText('a')).not.toBeInTheDocument();
    });
});
