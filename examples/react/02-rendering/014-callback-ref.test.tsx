import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeasureBox } from './014-callback-ref.tsx';

describe('014-callback-ref', () => {
  it('renders measure box', () => {
      render(<MeasureBox />);
      expect(screen.getByText('Box')).toBeInTheDocument();
      expect(screen.getByTestId('height')).toBeInTheDocument();
    });
});
