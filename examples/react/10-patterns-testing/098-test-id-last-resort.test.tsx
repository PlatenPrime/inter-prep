import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartStub } from './098-test-id-last-resort.tsx';

describe('098-test-id-last-resort', () => {
  it('finds chart root', () => {
      render(<ChartStub />);
      expect(screen.getByTestId('chart-root')).toBeInTheDocument();
    });
});
