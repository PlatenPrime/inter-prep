import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { DelayedGreeting } from './018-suspense-fallback.tsx';

describe('018-suspense-fallback', () => {
  it('shows fallback then content', async () => {
      render(<DelayedGreeting />);
      expect(screen.getByText('Loading…')).toBeInTheDocument();
      expect(await screen.findByText('Hi')).toBeInTheDocument();
    });
});
