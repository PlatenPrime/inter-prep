import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PolyButton } from './067-polymorphic-button.tsx';

describe('067-polymorphic-button', () => {
  it('renders as link', () => {
      render(
        <PolyButton as="a" href="/go">
          Go
        </PolyButton>,
      );
      expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go');
    });
});
