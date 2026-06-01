import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeasureWidth } from './029-use-layout-effect.tsx';

describe('029-use-layout-effect', () => {
  it('renders measured text', () => {
      render(<MeasureWidth text="Hello" />);
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByTestId('w')).toBeInTheDocument();
    });
});
