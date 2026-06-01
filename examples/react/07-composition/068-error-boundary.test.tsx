import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorDemo } from './068-error-boundary.tsx';

describe('068-error-boundary', () => {
  it('shows fallback', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<ErrorDemo />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      spy.mockRestore();
    });
});
