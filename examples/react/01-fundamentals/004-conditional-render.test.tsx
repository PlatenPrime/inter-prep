import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './004-conditional-render.tsx';

describe('004-conditional-render', () => {
  it('shows active and inactive', () => {
      const { rerender } = render(<StatusBadge active />);
      expect(screen.getByText('Active')).toBeInTheDocument();
      rerender(<StatusBadge active={false} />);
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
});
