import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentWithLoading } from './063-hoc-wrapper.tsx';

describe('063-hoc-wrapper', () => {
  it('shows loading', () => {
      render(<ContentWithLoading loading text="Hi" />);
      expect(screen.getByText('Loading…')).toBeInTheDocument();
    });
});
