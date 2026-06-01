import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './003-children-composition.tsx';

describe('003-children-composition', () => {
  it('renders children inside card', () => {
      render(
        <Card title="Stats">
          <p>42 users</p>
        </Card>,
      );
      expect(screen.getByText('42 users')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument();
    });
});
