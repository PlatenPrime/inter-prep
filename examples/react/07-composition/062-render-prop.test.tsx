import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MouseTracker } from './062-render-prop.tsx';

describe('062-render-prop', () => {
  it('renders position', () => {
      render(
        <MouseTracker>{(p) => <span data-testid="pos">{p.x},{p.y}</span>}</MouseTracker>,
      );
      expect(screen.getByTestId('pos')).toBeInTheDocument();
    });
});
